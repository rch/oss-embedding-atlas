#!/usr/bin/env python3
import argparse
import logging
from pathlib import Path
from typing import Iterator

import pandas as pd
import pyarrow.parquet as pq

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def index_gittables(directory: Path) -> Iterator[dict]:
    """
    Scans a directory for Parquet files and yields metadata for each column.
    """
    parquet_files = list(directory.rglob("*.parquet"))
    logging.info(f"Found {len(parquet_files)} parquet files in {directory}.")

    for file_path in parquet_files:
        try:
            # We only need the schema, so we don't load the actual data
            schema = pq.read_schema(file_path)
            table_name = file_path.stem  # Filename without extension

            for column_name in schema.names:
                field = schema.field(column_name)
                yield {
                    "source": "gittables",
                    "table_name": table_name,
                    "column_name": column_name,
                    "field_type": str(field.type),
                    "embedding_text": f"{table_name} - {column_name}"
                }
        except Exception as e:
            logging.error(f"Failed to read schema from {file_path}: {e}")


def index_iceberg(catalog_uri: str) -> Iterator[dict]:
    """
    Connects to an Iceberg REST catalog and yields metadata for each column across all tables.
    """
    try:
        from pyiceberg.catalog import load_catalog
    except ImportError:
        logging.error("The 'pyiceberg' library is required to index an Iceberg REST catalog.")
        logging.error("Please install it: pip install pyiceberg")
        return

    logging.info(f"Connecting to Iceberg REST Catalog at {catalog_uri}...")

    # Initialize a catalog using the REST URI
    cat = load_catalog("rest_catalog", type="rest", uri=catalog_uri)

    namespaces = cat.list_namespaces()
    logging.info(f"Found {len(namespaces)} namespaces.")

    for ns in namespaces:
        tables = cat.list_tables(ns)
        for tbl_id in tables:
            try:
                table = cat.load_table(tbl_id)
                schema = table.schema()
                # tbl_id is usually a tuple like ('db', 'table_name')
                table_name = ".".join(tbl_id)

                for field in schema.fields:
                    column_name = field.name
                    yield {
                        "source": "iceberg",
                        "table_name": table_name,
                        "column_name": column_name,
                        "field_type": str(field.field_type),
                        "embedding_text": f"{table_name} - {column_name}"
                    }
            except Exception as e:
                logging.error(f"Failed to process Iceberg table {tbl_id}: {e}")


def main():
    parser = argparse.ArgumentParser(description="Build Metadata Index for Embedding Atlas.")
    parser.add_argument("--source", choices=["gittables", "iceberg"], required=True,
                        help="The source format to index.")
    parser.add_argument("--dir", type=str,
                        help="Path to the directory of parquet files (required for gittables).")
    parser.add_argument("--catalog-uri", type=str,
                        help="REST catalog URI (required for iceberg).")
    parser.add_argument("--output", type=str, required=True,
                        help="Filepath to write the resulting .parquet index.")

    args = parser.parse_args()

    records = []

    if args.source == "gittables":
        if not args.dir:
            parser.error("--dir is required when source is 'gittables'")
        records = list(index_gittables(Path(args.dir)))

    elif args.source == "iceberg":
        if not args.catalog_uri:
            parser.error("--catalog-uri is required when source is 'iceberg'")
        records = list(index_iceberg(args.catalog_uri))

    if not records:
        logging.warning("No records were extracted. Exiting without writing file.")
        return

    logging.info(f"Extracted {len(records)} metadata records. Converting to DataFrame...")
    df = pd.DataFrame(records)

    # Validate the directory structure exists for the output
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    logging.info(f"Writing Parquet index to {output_path}...")
    df.to_parquet(output_path, index=False)
    logging.info("Done!")


if __name__ == "__main__":
    main()
