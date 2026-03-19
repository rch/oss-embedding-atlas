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
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Sequence

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


@dataclass
class ColumnProfile:
    kind: str
    observed_values: List[str]
    observed_set: set[str]
    weights: List[float]
    int_values: List[int]
    float_values: List[float]
    dt_values: List[datetime]
    lower_chars: List[str]
    upper_chars: List[str]
    digit_chars: List[str]
    local_parts: List[str]
    domains: List[str]


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
        "--rows-multiplier",
        type=int,
        default=5,
        help="Scale factor for output rows per source file (output_rows = source_rows * multiplier).",
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


def weighted_choice(values: Sequence[str], weights: Sequence[float], rng: random.Random) -> str:
    if not values:
        return ""
    total = sum(weights)
    if total <= 0:
        return rng.choice(list(values))
    needle = rng.random() * total
    acc = 0.0
    for value, weight in zip(values, weights):
        acc += weight
        if acc >= needle:
            return value
    return values[-1]


def parse_int(v: str) -> int | None:
    s = v.strip()
    if re.fullmatch(r"[+-]?\d+", s):
        try:
            return int(s)
        except ValueError:
            return None
    return None


def parse_float(v: str) -> float | None:
    s = v.strip()
    if re.fullmatch(r"[+-]?\d+(?:\.\d+)?", s):
        try:
            return float(s)
        except ValueError:
            return None
    return None


def infer_column_kind(non_empty_values: Sequence[str]) -> str:
    n = len(non_empty_values)
    if n == 0:
        return "empty"

    int_hits = sum(1 for v in non_empty_values if parse_int(v) is not None)
    float_hits = sum(1 for v in non_empty_values if parse_float(v) is not None)
    date_hits = sum(1 for v in non_empty_values if DATE_YMD_PATTERN.match(v.strip()))
    dt_hits = sum(1 for v in non_empty_values if DATETIME_PATTERN.match(v.strip()))
    email_hits = sum(1 for v in non_empty_values if EMAIL_PATTERN.match(v.strip()))

    unique_count = len(set(non_empty_values))
    categorical_threshold = max(10, min(100, int(0.15 * n)))

    if all(BOOL_PATTERN.match(v.strip()) for v in non_empty_values):
        return "categorical"
    if dt_hits / n >= 0.95:
        return "datetime"
    if date_hits / n >= 0.95:
        return "date"
    if int_hits / n >= 0.95:
        return "integer"
    if float_hits / n >= 0.95:
        return "float"
    if email_hits / n >= 0.95:
        return "email"
    if unique_count <= categorical_threshold:
        return "categorical"
    if sum(1 for v in non_empty_values if " " in v) / n >= 0.5:
        return "text"
    return "pattern"


def build_profile(values: Sequence[str]) -> ColumnProfile:
    non_empty_values = [v for v in values if (v or "").strip()]
    counts = Counter(non_empty_values)
    observed_values = list(counts.keys())
    weights = [float(counts[v]) for v in observed_values]
    kind = infer_column_kind(non_empty_values)

    int_values = [x for v in non_empty_values if (x := parse_int(v)) is not None]
    float_values = [x for v in non_empty_values if (x := parse_float(v)) is not None]

    dt_values: List[datetime] = []
    if kind == "date":
        for v in non_empty_values:
            try:
                dt_values.append(datetime.strptime(v.strip(), "%Y-%m-%d"))
            except ValueError:
                continue
    if kind == "datetime":
        for v in non_empty_values:
            normalized = v.strip().replace("T", " ").rstrip("Z")
            try:
                dt_values.append(datetime.strptime(normalized[:19], "%Y-%m-%d %H:%M:%S"))
            except ValueError:
                continue

    lower_chars = [c for v in non_empty_values for c in v if c.islower()] or list("abcdefghijklmnopqrstuvwxyz")
    upper_chars = [c for v in non_empty_values for c in v if c.isupper()] or list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    digit_chars = [c for v in non_empty_values for c in v if c.isdigit()] or list("0123456789")

    local_parts: List[str] = []
    domains: List[str] = []
    for v in non_empty_values:
        s = v.strip()
        if EMAIL_PATTERN.match(s):
            local, domain = s.split("@", 1)
            local_parts.append(local)
            domains.append(domain)

    return ColumnProfile(
        kind=kind,
        observed_values=observed_values,
        observed_set=set(observed_values),
        weights=weights,
        int_values=int_values,
        float_values=float_values,
        dt_values=dt_values,
        lower_chars=lower_chars,
        upper_chars=upper_chars,
        digit_chars=digit_chars,
        local_parts=local_parts,
        domains=domains,
    )


def random_hex(rng: random.Random, n: int) -> str:
    return "".join(rng.choice("0123456789abcdef") for _ in range(n))


def mutate_with_profile_chars(value: str, profile: ColumnProfile, rng: random.Random) -> str:
    out: List[str] = []
    for ch in value:
        if ch.isdigit():
            out.append(rng.choice(profile.digit_chars))
        elif ch.islower():
            out.append(rng.choice(profile.lower_chars))
        elif ch.isupper():
            out.append(rng.choice(profile.upper_chars))
        else:
            out.append(ch)
    return "".join(out)


def mutate_value(value: str, profile: ColumnProfile, rng: random.Random, index: int) -> str:
    stripped = value.strip()
    if not stripped:
        return ""

    if BOOL_PATTERN.match(stripped):
        return weighted_choice(profile.observed_values, profile.weights, rng).lower()

    if UUID_PATTERN.match(stripped):
        return f"{random_hex(rng, 8)}-{random_hex(rng, 4)}-{random_hex(rng, 4)}-{random_hex(rng, 4)}-{random_hex(rng, 12)}"

    if EMAIL_PATTERN.match(stripped):
        local = rng.choice(profile.local_parts) if profile.local_parts else "user"
        domain = rng.choice(profile.domains) if profile.domains else "example.com"
        local = re.sub(r"[^A-Za-z0-9._+-]", "", local) or "user"
        return f"{local[:12]}{rng.randint(1, 999)}@{domain.lower()}"

    if IPV4_PATTERN.match(stripped):
        return ".".join(str(rng.randint(1, 254)) for _ in range(4))

    if DATE_YMD_PATTERN.match(stripped):
        if profile.dt_values:
            base_dt = rng.choice(profile.dt_values)
            delta = rng.randint(-90, 90)
            return (base_dt + timedelta(days=delta)).strftime("%Y-%m-%d")

    if DATETIME_PATTERN.match(stripped):
        if profile.dt_values:
            base_dt = rng.choice(profile.dt_values)
            delta = rng.randint(-86400 * 7, 86400 * 7)
            return (base_dt + timedelta(seconds=delta)).strftime("%Y-%m-%d %H:%M:%S")

    if stripped.isdigit():
        if profile.int_values:
            base_int = rng.choice(profile.int_values)
            jitter = rng.randint(-max(1, abs(base_int) // 20), max(1, abs(base_int) // 20))
            return str(base_int + jitter)
        return mutate_with_profile_chars(stripped, profile, rng)

    if re.fullmatch(r"[A-Za-z0-9_-]+", stripped):
        token = mutate_with_profile_chars(stripped, profile, rng)
        if token == stripped:
            return f"{token}_{index}"
        return token

    mixed = mutate_with_profile_chars(stripped, profile, rng)
    if mixed == stripped:
        return f"{mixed}_{index}"
    return mixed


def synthesize_column_values(
    profile: ColumnProfile,
    source_values: Sequence[str],
    target_size: int,
    rng: random.Random,
    column_name: str,
    base_values: Sequence[str] | None = None,
) -> List[str]:
    if column_name.endswith(".row_id"):
        return [str(i + 1) for i in range(target_size)]

    non_empty = [v for v in source_values if (v or "").strip()]
    unique_non_empty = list(dict.fromkeys(non_empty))
    source_set = set(unique_non_empty)

    if not unique_non_empty:
        return [""] * target_size

    if profile.kind == "categorical":
        return [weighted_choice(profile.observed_values, profile.weights, rng) for _ in range(target_size)]

    if profile.kind == "integer" and profile.int_values:
        out_int: List[str] = []
        for _ in range(target_size):
            base_int = rng.choice(profile.int_values)
            jitter = rng.randint(-max(1, abs(base_int) // 20), max(1, abs(base_int) // 20))
            out_int.append(str(base_int + jitter))
        return out_int

    if profile.kind == "float" and profile.float_values:
        out_float: List[str] = []
        for _ in range(target_size):
            base_float = rng.choice(profile.float_values)
            jitter = (rng.random() - 0.5) * max(0.01, abs(base_float) * 0.05)
            out_float.append(f"{base_float + jitter:.6f}".rstrip("0").rstrip("."))
        return out_float

    out: List[str] = []
    for i in range(target_size):
        if base_values and i < len(base_values):
            base = base_values[i]
        else:
            base = unique_non_empty[i % len(unique_non_empty)]

        candidate = mutate_value(base, profile, rng, i)

        # Retry a few times to reduce direct copies from source values.
        retries = 0
        while candidate in source_set and retries < 6:
            candidate = mutate_value(base, profile, rng, i + retries + 1)
            retries += 1

        out.append(candidate)
    return out


def build_generated_rows(header: Sequence[str], source_rows: Sequence[Dict[str, str]], target_rows: int, seed: int) -> List[Dict[str, str]]:
    if not source_rows:
        source_rows = [{}]

    profiles: Dict[str, ColumnProfile] = {}
    for column in header:
        values = [row.get(column, "") for row in source_rows]
        profiles[column] = build_profile(values)

    # Row bootstrap keeps multi-column dependencies close to source distribution.
    bootstrap_rows = [source_rows[random.Random(column_seed(seed, f"row:{i}")).randrange(len(source_rows))] for i in range(target_rows)]

    generated_columns: Dict[str, List[str]] = {}
    for column in header:
        values = [row.get(column, "") for row in source_rows]
        rng = random.Random(column_seed(seed, column))
        profile = profiles[column]
        base_values = [row.get(column, "") for row in bootstrap_rows]

        if profile.kind == "categorical":
            mutation_rate = 0.15
        elif profile.kind in {"integer", "float", "date", "datetime"}:
            mutation_rate = 0.30
        else:
            mutation_rate = 0.45

        sampled = synthesize_column_values(
            profile=profile,
            source_values=values,
            target_size=target_rows,
            rng=rng,
            column_name=column,
            base_values=base_values,
        )

        mixed: List[str] = []
        for idx in range(target_rows):
            if column.endswith(".row_id"):
                mixed.append(str(idx + 1))
                continue
            if rng.random() > mutation_rate:
                mixed.append(base_values[idx])
            else:
                mixed.append(sampled[idx])
        generated_columns[column] = mixed

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
    if args.rows_multiplier <= 0:
        raise ValueError("--rows-multiplier must be > 0")

    annotations = read_annotations(args.annotations)
    source_files = list_source_csvs(args.source_dir)

    args.output_dir.mkdir(parents=True, exist_ok=True)

    mapped_columns_by_ontology: Dict[str, List[str]] = {k: [] for k in annotations.keys()}
    generated_value_count_by_ontology: Dict[str, int] = {k: 0 for k in annotations.keys()}
    file_summaries: List[Dict[str, object]] = []

    for source_csv in source_files:
        header, source_rows = read_csv(source_csv)
        output_rows = max(len(source_rows) * args.rows_multiplier, args.examples_per_label)

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
                "rows_multiplier": args.rows_multiplier,
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
            "rows_multiplier": args.rows_multiplier,
            "seed": args.seed,
            "include_deprecated": True,
            "output_format": "wide",
            "sampler": "empirical-row-bootstrap",
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
