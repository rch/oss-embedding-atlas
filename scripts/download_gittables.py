#!/usr/bin/env python3
import argparse
import hashlib
import json
import logging
import os
import re
import tempfile
import urllib.request
import zipfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

ZENODO_API_URL = "https://zenodo.org/api/records/6517052"
DEST_DIR = Path("thirdparty/datasets/gittables")
MAX_FILENAME_LENGTH = 180

def sanitize_filename(name: str) -> str:
    """Clean the filename to make it Iceberg/filesystem friendly."""
    # Remove directory paths if any
    name = os.path.basename(name)
    # Separate name and extension
    base, ext = os.path.splitext(name)
    # Replace anything that isn't alphanumeric with underscores
    clean_base = re.sub(r'[^a-zA-Z0-9]+', '_', base).strip('_').lower()
    return f"{clean_base}{ext}"

def make_bounded_filename(source_name: str, group_name: str, max_length: int = MAX_FILENAME_LENGTH) -> str:
    """Create deterministic, bounded-length parquet filename."""
    clean_name = sanitize_filename(source_name)
    clean_base, ext = os.path.splitext(clean_name)
    ext = ext.lower() or ".parquet"

    source_hash = hashlib.sha1(source_name.encode("utf-8")).hexdigest()[:12]
    prefix = f"{group_name}_{clean_base}" if group_name else clean_base
    suffix = f"_{source_hash}"

    max_base_len = max(1, max_length - len(ext))
    keep_len = max(1, max_base_len - len(suffix))
    trimmed_prefix = prefix[:keep_len].rstrip("_") or "table"

    return f"{trimmed_prefix}{suffix}{ext}"

def is_valid_zip(path: Path) -> bool:
    """Check if zip exists and is readable."""
    if not path.exists():
        return False

    try:
        with zipfile.ZipFile(path, "r") as zip_ref:
            return zip_ref.testzip() is None
    except zipfile.BadZipFile:
        return False

def download_file(url: str, dest_path: Path):
    if dest_path.exists():
        logging.info(f"File {dest_path} already exists. Skipping download.")
        return

    temp_dest_path = dest_path.with_name(f"{dest_path.name}.part")
    logging.info(f"Downloading {url} to {dest_path}")
    urllib.request.urlretrieve(url, temp_dest_path)
    temp_dest_path.replace(dest_path)
    logging.info(f"Finished downloading {dest_path}")

def process_zip_incrementally(zip_info: dict, dest_dir: Path):
    """
    Download, extract, clean names, and recompress incrementally.
    This saves disk space by immediately cleaning up the downloaded zip and
    creating a new, cleaned zip archive.
    """
    url = zip_info["links"]["self"]
    original_filename = zip_info["key"]
    recompressed_zip_path = dest_dir / f"cleaned_{original_filename}"

    if is_valid_zip(recompressed_zip_path):
        logging.info(f"File {recompressed_zip_path} already exists and is valid. Skipping.")
        return

    if recompressed_zip_path.exists():
        logging.warning(f"File {recompressed_zip_path} exists but is invalid. Re-processing.")
        recompressed_zip_path.unlink(missing_ok=True)

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_dir_path = Path(temp_dir)
        download_path = temp_dir_path / original_filename

        # 1. Download
        download_file(url, download_path)

        # 2. Extract
        extract_dir = temp_dir_path / "extracted"
        extract_dir.mkdir()
        logging.info(f"Extracting {download_path}...")
        try:
            with zipfile.ZipFile(download_path, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)
        except zipfile.BadZipFile:
            logging.error(f"Failed to extract {original_filename}: Bad Zip File.")
            return

        # 3. Clean names and recompress directly
        parquet_files = list(extract_dir.rglob("*.parquet"))
        if not parquet_files:
            logging.warning(f"No parquet files found in {original_filename}.")
            return

        logging.info(f"Found {len(parquet_files)} parquet files. Cleaning names...")
        group_name = os.path.splitext(original_filename)[0].lower().replace("_licensed", "")

        temp_zip_path = dest_dir / f".{recompressed_zip_path.name}.part"
        if temp_zip_path.exists():
            temp_zip_path.unlink()

        logging.info(f"Recompressing {len(parquet_files)} files to {recompressed_zip_path}...")
        with zipfile.ZipFile(temp_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in parquet_files:
                source_id = str(file_path.relative_to(extract_dir))
                final_name = make_bounded_filename(source_id, group_name)
                zipf.write(file_path, arcname=final_name)

        temp_zip_path.replace(recompressed_zip_path)

        logging.info(f"Finished processing {original_filename} incrementally.")

def process_zip_standard(zip_info: dict, dest_dir: Path):
    """
    Standard parallel download. Leaves the zip as-is without recompressing.
    Useful if you just want to download the raw files as quickly as possible.
    """
    url = zip_info["links"]["self"]
    original_filename = zip_info["key"]
    download_path = dest_dir / f"raw_{original_filename}"

    if download_path.exists():
        logging.info(f"File {download_path} already exists. Skipping.")
        return

    download_file(url, download_path)

def main():
    parser = argparse.ArgumentParser(description="Download GitTables 1M from Zenodo.")
    parser.add_argument("--incremental", action="store_true",
                        help="Clean, organize, and recompress each group of files incrementally to save space.")
    parser.add_argument("--workers", type=int, default=4,
                        help="Number of concurrent downloads (when not using --incremental).")
    args = parser.parse_args()

    DEST_DIR.mkdir(parents=True, exist_ok=True)

    logging.info(f"Fetching metadata from {ZENODO_API_URL}...")
    req = urllib.request.Request(ZENODO_API_URL)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())

    files = data.get("files", [])
    zip_files = [f for f in files if f["key"].endswith(".zip")]

    logging.info(f"Found {len(zip_files)} zip files to process.")

    if args.incremental:
        logging.info("Running in incremental mode: Download -> Extract -> Clean -> Recompress -> Delete")
        for zip_info in zip_files:
            process_zip_incrementally(zip_info, DEST_DIR)
    else:
        logging.info(f"Running in standard mode: downloading raw zips with {args.workers} workers")
        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            for zip_info in zip_files:
                executor.submit(process_zip_standard, zip_info, DEST_DIR)

    logging.info("All files processed successfully!")

if __name__ == "__main__":
    main()
