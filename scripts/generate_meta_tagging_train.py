#!/usr/bin/env python3
"""Generate expanded wide-format meta-tagging training CSVs.

This script reads controlled vocabulary labels from annotations.csv, discovers ontology-linked
columns in the meta_tagging_csv domain files, and writes expanded synthetic training CSVs while
preserving each source file's schema and column order.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import logging
import random
import re
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Iterable, List, Sequence

LOG = logging.getLogger(__name__)

ONTOLOGY_ID_PATTERN = re.compile(r"^\d+(?:\.\d+)*$")
ONTOLOGY_COLUMN_PATTERN = re.compile(
    r"^(attr|ref|var|code|key|field|val|item|data|col)_(\d+(?:_\d+)*)$"
)
UUID_PATTERN = re.compile(
    r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
)
IPV4_PATTERN = re.compile(r"^(?:\d{1,3}\.){3}\d{1,3}$")
DATE_YMD_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
DATETIME_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$")
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
BOOL_PATTERN = re.compile(r"^(true|false|yes|no|y|n)$", re.IGNORECASE)


@dataclass(frozen=True)
class Annotation:
    ontology_id: str
    label: str
    deprecated: bool


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate expanded meta-tagging training CSVs.")
    parser.add_argument(
        "--annotations",
        type=Path,
        default=Path("build/datasets/meta_tagging_csv/annotations.csv"),
        help="Path to annotations.csv controlled vocabulary file.",
    )
    parser.add_argument(
        "--source-dir",
        type=Path,
        default=Path("build/datasets/meta_tagging_csv"),
        help="Directory containing source wide CSV files.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("build/datasets/meta_tagging_train"),
        help="Target directory for generated training CSVs.",
    )
    parser.add_argument(
        "--examples-per-label",
        type=int,
        default=10,
        help="Target minimum synthetic examples per mapped ontology label/column.",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=1337,
        help="Random seed for deterministic generation.",
    )
    parser.add_argument(
        "--log-level",
        type=str,
        default="INFO",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        help="Logging verbosity.",
    )
    return parser.parse_args()


def setup_logging(level: str) -> None:
    logging.basicConfig(level=getattr(logging, level), format="%(asctime)s %(levelname)s %(message)s")


def parse_bool(value: str) -> bool:
    return value.strip().lower() in {"y", "yes", "true", "1"}


def read_annotations(path: Path) -> Dict[str, Annotation]:
    rows: List[List[str]] = []
    with path.open("r", newline="", encoding="utf-8") as fh:
        reader = csv.reader(fh)
        rows = list(reader)

    header_idx = -1
    for i, row in enumerate(rows):
        if not row:
            continue
        first = row[0].strip().lstrip("\ufeff").lstrip("'").strip()
        if first == "ID":
            header_idx = i
            break
    if header_idx == -1:
        raise ValueError(f"Could not find annotations header row in {path}")

    header = rows[header_idx]
    idx_by_name: Dict[str, int] = {}
    for i, raw_name in enumerate(header):
        name = raw_name.strip().lstrip("\ufeff").lstrip("'").strip()
        idx_by_name[name] = i
    required = ["ID", "Ontology", "Deprecated"]
    missing = [name for name in required if name not in idx_by_name]
    if missing:
        raise ValueError(f"Missing required annotations columns: {', '.join(missing)}")

    annotations: Dict[str, Annotation] = {}
    for row in rows[header_idx + 1 :]:
        if not row:
            continue
        raw_id = row[idx_by_name["ID"]].strip() if idx_by_name["ID"] < len(row) else ""
        if not raw_id or not ONTOLOGY_ID_PATTERN.match(raw_id):
            continue

        label = row[idx_by_name["Ontology"]].strip() if idx_by_name["Ontology"] < len(row) else ""
        deprecated_raw = row[idx_by_name["Deprecated"]] if idx_by_name["Deprecated"] < len(row) else ""
        annotations[raw_id] = Annotation(
            ontology_id=raw_id,
            label=label or raw_id,
            deprecated=parse_bool(deprecated_raw or ""),
        )

    if not annotations:
        raise ValueError(f"No valid ontology labels parsed from {path}")
    return annotations


def list_source_csvs(source_dir: Path) -> List[Path]:
    csvs = sorted(p for p in source_dir.glob("*.csv") if p.name != "annotations.csv")
    if not csvs:
        raise ValueError(f"No source domain CSVs found in {source_dir}")
    return csvs


def read_csv(path: Path) -> tuple[List[str], List[Dict[str, str]]]:
    with path.open("r", newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        if not reader.fieldnames:
            raise ValueError(f"File has no header: {path}")
        rows = [dict(row) for row in reader]
        return list(reader.fieldnames), rows


def extract_ontology_id_from_column(column_name: str) -> str | None:
    tail = column_name.split(".")[-1]
    match = ONTOLOGY_COLUMN_PATTERN.match(tail)
    if not match:
        return None
    return match.group(2).replace("_", ".")


def column_seed(base_seed: int, key: str) -> int:
    digest = hashlib.sha256(f"{base_seed}:{key}".encode("utf-8")).hexdigest()
    return int(digest[:16], 16)


def random_hex(rng: random.Random, n: int) -> str:
    return "".join(rng.choice("0123456789abcdef") for _ in range(n))


def mutate_digits(value: str, rng: random.Random) -> str:
    digits = [c for c in value if c.isdigit()]
    if not digits:
        return value
    out: List[str] = []
    for ch in value:
        if ch.isdigit():
            out.append(str(rng.randint(0, 9)))
        else:
            out.append(ch)
    return "".join(out)


def mutate_alnum(value: str, rng: random.Random) -> str:
    out: List[str] = []
    for ch in value:
        if ch.isdigit():
            out.append(str(rng.randint(0, 9)))
        elif ch.islower():
            out.append(chr(ord("a") + rng.randint(0, 25)))
        elif ch.isupper():
            out.append(chr(ord("A") + rng.randint(0, 25)))
        else:
            out.append(ch)
    return "".join(out)


def mutate_value(value: str, rng: random.Random, index: int) -> str:
    stripped = value.strip()
    if not stripped:
        return ""

    if BOOL_PATTERN.match(stripped):
        return rng.choice(["true", "false"])

    if UUID_PATTERN.match(stripped):
        return f"{random_hex(rng, 8)}-{random_hex(rng, 4)}-{random_hex(rng, 4)}-{random_hex(rng, 4)}-{random_hex(rng, 12)}"

    if EMAIL_PATTERN.match(stripped):
        local, domain = stripped.split("@", 1)
        local = re.sub(r"[^A-Za-z0-9]", "", local) or "user"
        domain_root, _, domain_tld = domain.rpartition(".")
        domain_root = re.sub(r"[^A-Za-z0-9]", "", domain_root or "example")
        domain_tld = re.sub(r"[^A-Za-z]", "", domain_tld or "com") or "com"
        return f"{local[:8]}{rng.randint(100, 9999)}@{domain_root[:10]}{rng.randint(1,99)}.{domain_tld[:6].lower()}"

    if IPV4_PATTERN.match(stripped):
        return ".".join(str(rng.randint(1, 254)) for _ in range(4))

    if DATE_YMD_PATTERN.match(stripped):
        try:
            dt = datetime.strptime(stripped, "%Y-%m-%d")
            delta = rng.randint(-3650, 3650)
            return (dt + timedelta(days=delta)).strftime("%Y-%m-%d")
        except ValueError:
            pass

    if DATETIME_PATTERN.match(stripped):
        normalized = stripped.replace("T", " ").rstrip("Z")
        fmt = "%Y-%m-%d %H:%M:%S"
        try:
            dt = datetime.strptime(normalized[:19], fmt)
            delta = rng.randint(-86400 * 365, 86400 * 365)
            return (dt + timedelta(seconds=delta)).strftime("%Y-%m-%d %H:%M:%S")
        except ValueError:
            pass

    if stripped.isdigit():
        return mutate_digits(stripped, rng)

    if re.fullmatch(r"[A-Za-z0-9_-]+", stripped):
        token = mutate_alnum(stripped, rng)
        if token == stripped:
            return f"{token}_{index}"
        return token

    mixed = mutate_alnum(stripped, rng)
    if mixed == stripped:
        return f"{mixed}_{index}"
    return mixed


def synthesize_column_values(
    source_values: Sequence[str],
    target_size: int,
    rng: random.Random,
    column_name: str,
) -> List[str]:
    if column_name.endswith(".row_id"):
        return [str(i + 1) for i in range(target_size)]

    non_empty = [v for v in source_values if (v or "").strip()]
    unique_non_empty = list(dict.fromkeys(non_empty))
    source_set = set(unique_non_empty)

    if not unique_non_empty:
        return [""] * target_size

    out: List[str] = []
    for i in range(target_size):
        base = unique_non_empty[i % len(unique_non_empty)]
        candidate = mutate_value(base, rng, i)

        # Retry a few times to reduce direct copies from source values.
        retries = 0
        while candidate in source_set and retries < 6:
            candidate = mutate_value(base, rng, i + retries + 1)
            retries += 1

        out.append(candidate)
    return out


def build_generated_rows(header: Sequence[str], source_rows: Sequence[Dict[str, str]], target_rows: int, seed: int) -> List[Dict[str, str]]:
    if not source_rows:
        source_rows = [{}]

    generated_columns: Dict[str, List[str]] = {}
    for column in header:
        values = [row.get(column, "") for row in source_rows]
        rng = random.Random(column_seed(seed, column))
        generated_columns[column] = synthesize_column_values(values, target_rows, rng, column)

    out: List[Dict[str, str]] = []
    for idx in range(target_rows):
        row = {column: generated_columns[column][idx] for column in header}
        out.append(row)
    return out


def write_csv(path: Path, header: Sequence[str], rows: Sequence[Dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=list(header), extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    args = parse_args()
    setup_logging(args.log_level)

    if args.examples_per_label <= 0:
        raise ValueError("--examples-per-label must be > 0")

    annotations = read_annotations(args.annotations)
    source_files = list_source_csvs(args.source_dir)

    args.output_dir.mkdir(parents=True, exist_ok=True)

    mapped_columns_by_ontology: Dict[str, List[str]] = {k: [] for k in annotations.keys()}
    generated_value_count_by_ontology: Dict[str, int] = {k: 0 for k in annotations.keys()}
    file_summaries: List[Dict[str, object]] = []

    for source_csv in source_files:
        header, source_rows = read_csv(source_csv)
        output_rows = max(len(source_rows), args.examples_per_label)

        generated_rows = build_generated_rows(
            header=header,
            source_rows=source_rows,
            target_rows=output_rows,
            seed=column_seed(args.seed, source_csv.name),
        )

        target_csv = args.output_dir / source_csv.name
        write_csv(target_csv, header, generated_rows)

        ontology_columns = 0
        for col in header:
            ontology_id = extract_ontology_id_from_column(col)
            if not ontology_id:
                continue
            if ontology_id not in annotations:
                continue
            ontology_columns += 1
            mapped_columns_by_ontology[ontology_id].append(f"{source_csv.name}:{col}")
            generated_value_count_by_ontology[ontology_id] += output_rows

        file_summaries.append(
            {
                "file": source_csv.name,
                "source_rows": len(source_rows),
                "output_rows": output_rows,
                "columns": len(header),
                "ontology_linked_columns": ontology_columns,
            }
        )
        LOG.info("Generated %s (%d -> %d rows)", source_csv.name, len(source_rows), output_rows)

    unmatched_ontology_ids = [
        ontology_id
        for ontology_id, cols in mapped_columns_by_ontology.items()
        if not cols
    ]

    ontology_summary = []
    for ontology_id, annotation in sorted(annotations.items(), key=lambda item: tuple(int(p) for p in item[0].split("."))):
        ontology_summary.append(
            {
                "ontology_id": ontology_id,
                "label": annotation.label,
                "deprecated": annotation.deprecated,
                "mapped_column_count": len(mapped_columns_by_ontology[ontology_id]),
                "generated_value_count": generated_value_count_by_ontology[ontology_id],
            }
        )

    manifest = {
        "parameters": {
            "annotations": str(args.annotations),
            "source_dir": str(args.source_dir),
            "output_dir": str(args.output_dir),
            "examples_per_label": args.examples_per_label,
            "seed": args.seed,
            "include_deprecated": True,
            "output_format": "wide",
        },
        "summary": {
            "total_labels": len(annotations),
            "deprecated_labels": sum(1 for a in annotations.values() if a.deprecated),
            "mapped_labels": sum(1 for cols in mapped_columns_by_ontology.values() if cols),
            "unmapped_labels": len(unmatched_ontology_ids),
            "files_generated": len(file_summaries),
        },
        "files": file_summaries,
        "ontology_summary": ontology_summary,
        "unmatched_ontology_ids": unmatched_ontology_ids,
    }

    manifest_path = args.output_dir / "meta_tagging_train.manifest.json"
    with manifest_path.open("w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2)

    # Keep a snapshot of controlled vocabulary in the output directory.
    annotations_target = args.output_dir / "annotations.csv"
    annotations_target.write_text(args.annotations.read_text(encoding="utf-8"), encoding="utf-8")

    LOG.info("Wrote manifest: %s", manifest_path)
    LOG.info("Done. Generated %d files in %s", len(file_summaries), args.output_dir)


if __name__ == "__main__":
    main()
