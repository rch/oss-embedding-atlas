#!/usr/bin/env python3
import argparse
import logging
import re
import zipfile
from pathlib import Path


def configure_logging() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def iter_cleaned_zips(input_dir: Path) -> list[Path]:
    return sorted(input_dir.glob("cleaned_*_licensed.zip"))


def zip_group_name(zip_path: Path) -> str:
    stem = zip_path.stem
    stem = re.sub(r"^cleaned_", "", stem)
    stem = re.sub(r"_licensed$", "", stem)
    return stem


def shard_path_for_zip(zip_path: Path, shard_dir: Path) -> Path:
    return shard_dir / f"metadata__{zip_path.stem}.parquet"


def is_valid_shard(path: Path) -> bool:
    if not path.exists():
        return False

    try:
        import pyarrow.parquet as pq
    except ImportError:
        return False

    try:
        metadata = pq.read_metadata(path)
        return metadata.num_rows > 0 and metadata.num_columns > 0
    except Exception:
        return False


def extract_records_from_zip(zip_path: Path) -> list[dict]:
    try:
        import pyarrow as pa
        import pyarrow.parquet as pq
    except ImportError as exc:
        raise RuntimeError(
            "Missing dependency 'pyarrow'. Install backend deps first, e.g. from packages/backend/pyproject.toml."
        ) from exc

    records: list[dict] = []
    group_name = zip_group_name(zip_path)

    with zipfile.ZipFile(zip_path, "r") as zf:
        parquet_members = [n for n in zf.namelist() if n.endswith(".parquet")]
        logging.info("%s: %d parquet members", zip_path.name, len(parquet_members))

        for member in parquet_members:
            try:
                payload = zf.read(member)
                schema = pq.read_schema(pa.BufferReader(payload))
                table_name = Path(member).stem

                for column_name in schema.names:
                    field = schema.field(column_name)
                    records.append(
                        {
                            "source": "gittables",
                            "zip_file": zip_path.name,
                            "group_name": group_name,
                            "table_name": table_name,
                            "column_name": column_name,
                            "field_type": str(field.type),
                            "embedding_text": f"{table_name} - {column_name}",
                        }
                    )
            except Exception as exc:
                logging.error("Failed reading member %s from %s: %s", member, zip_path.name, exc)

    return records


def write_shard(records: list[dict], output_path: Path) -> int:
    import pyarrow as pa
    import pyarrow.parquet as pq

    output_path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = output_path.with_suffix(output_path.suffix + ".part")

    table = pa.Table.from_pylist(records)
    pq.write_table(table, temp_path)
    temp_path.replace(output_path)
    return table.num_rows


def consolidate_shards(shard_paths: list[Path], output_path: Path) -> int:
    import pyarrow.parquet as pq

    output_path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = output_path.with_suffix(output_path.suffix + ".part")
    if temp_path.exists():
        temp_path.unlink()

    writer = None
    total_rows = 0

    try:
        for shard_path in sorted(shard_paths):
            shard_table = pq.read_table(shard_path)
            if writer is None:
                writer = pq.ParquetWriter(temp_path, shard_table.schema)
            writer.write_table(shard_table)
            total_rows += shard_table.num_rows
    finally:
        if writer is not None:
            writer.close()

    if writer is None:
        raise RuntimeError("No shard data found to consolidate.")

    temp_path.replace(output_path)
    return total_rows


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Extract GitTables metadata from cleaned zip archives and build consolidated parquet."
    )
    parser.add_argument(
        "--input-dir",
        type=Path,
        default=Path("thirdparty/datasets/gittables"),
        help="Directory containing cleaned_*_licensed.zip files.",
    )
    parser.add_argument(
        "--shard-dir",
        type=Path,
        default=Path("build/datasets/gittables/metadata_shards"),
        help="Directory for per-zip metadata shard parquet files.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("build/datasets/gittables_metadata.parquet"),
        help="Consolidated output parquet path.",
    )
    parser.add_argument(
        "--sample-zips",
        type=int,
        default=None,
        help="Only process the first N cleaned zip files (for quick sampling).",
    )
    parser.add_argument(
        "--force-rebuild-shards",
        action="store_true",
        help="Rebuild shard files even if they already exist.",
    )
    parser.add_argument(
        "--skip-consolidate",
        action="store_true",
        help="Only build/update shards and skip writing consolidated output.",
    )
    args = parser.parse_args()

    configure_logging()

    zip_paths = iter_cleaned_zips(args.input_dir)
    if args.sample_zips is not None:
        zip_paths = zip_paths[: args.sample_zips]

    if not zip_paths:
        logging.warning("No cleaned zip files found under %s", args.input_dir)
        return

    logging.info("Discovered %d cleaned zip files.", len(zip_paths))

    processed = 0
    skipped = 0

    for zip_path in zip_paths:
        shard_path = shard_path_for_zip(zip_path, args.shard_dir)
        if shard_path.exists() and not args.force_rebuild_shards:
            if is_valid_shard(shard_path):
                skipped += 1
                logging.info("Skipping %s (valid shard exists: %s)", zip_path.name, shard_path.name)
                continue

            logging.warning("Rebuilding %s because shard is invalid: %s", zip_path.name, shard_path.name)
            shard_path.unlink(missing_ok=True)

        try:
            records = extract_records_from_zip(zip_path)
        except RuntimeError as exc:
            logging.error("%s", exc)
            raise SystemExit(2) from exc
        if not records:
            logging.warning("No records extracted for %s", zip_path.name)
            continue

        row_count = write_shard(records, shard_path)
        processed += 1
        logging.info("Wrote shard %s with %d rows", shard_path.name, row_count)

    shard_paths = sorted(args.shard_dir.glob("metadata__*.parquet"))
    logging.info(
        "Shard status: %d total, %d processed this run, %d skipped existing",
        len(shard_paths),
        processed,
        skipped,
    )

    if args.skip_consolidate:
        logging.info("--skip-consolidate enabled; stopping after shard generation.")
        return

    if not shard_paths:
        logging.warning("No shard files available to consolidate.")
        return

    total_rows = consolidate_shards(shard_paths, args.output)
    logging.info("Wrote consolidated metadata parquet: %s (%d rows)", args.output, total_rows)
    logging.info(
        "Use with Embedding Atlas, for example: embedding-atlas %s --text embedding_text",
        args.output,
    )


if __name__ == "__main__":
    main()
