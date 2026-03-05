#!/usr/bin/env python3
import argparse
import datetime as dt
import hashlib
import json
import os
import platform
import subprocess
import time
from dataclasses import dataclass
from pathlib import Path

from ortools.sat.python import cp_model
from pyhocon import ConfigFactory, HOCONConverter


@dataclass(frozen=True)
class GpuInfo:
    name: str
    memory_gb: float


@dataclass(frozen=True)
class HardwareSnapshot:
    hostname: str
    os: str
    arch: str
    cpu_logical_cores: int
    ram_gb: float
    gpus: list[GpuInfo]


@dataclass(frozen=True)
class RuntimeProfile:
    name: str
    score: int
    min_gpu_count: int
    min_gpu_memory_gb: float
    gpu_name_patterns: tuple[str, ...]
    env: dict[str, str]
    notes: str


def detect_nvidia_gpus() -> list[GpuInfo]:
    command = [
        "nvidia-smi",
        "--query-gpu=name,memory.total",
        "--format=csv,noheader,nounits",
    ]
    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        return []

    gpus: list[GpuInfo] = []
    for line in result.stdout.splitlines():
        if not line.strip():
            continue
        parts = [part.strip() for part in line.split(",", maxsplit=1)]
        if len(parts) != 2:
            continue
        name, memory_mb_str = parts
        try:
            memory_gb = float(memory_mb_str) / 1024.0
        except ValueError:
            continue
        gpus.append(GpuInfo(name=name, memory_gb=round(memory_gb, 2)))
    return gpus


def detect_ram_gb() -> float:
    if hasattr(os, "sysconf"):
        try:
            page_size = int(os.sysconf("SC_PAGE_SIZE"))
            pages = int(os.sysconf("SC_PHYS_PAGES"))
            return round((page_size * pages) / (1024**3), 2)
        except (ValueError, OSError):
            pass
    return 0.0


def collect_snapshot() -> HardwareSnapshot:
    return HardwareSnapshot(
        hostname=platform.node(),
        os=platform.platform(),
        arch=platform.machine(),
        cpu_logical_cores=os.cpu_count() or 1,
        ram_gb=detect_ram_gb(),
        gpus=detect_nvidia_gpus(),
    )


def build_profiles() -> list[RuntimeProfile]:
    return [
        RuntimeProfile(
            name="laptop",
            score=10,
            min_gpu_count=0,
            min_gpu_memory_gb=0.0,
            gpu_name_patterns=(),
            notes="CPU or low-GPU-memory laptop defaults",
            env={
                "ATLAS_USE_SYNTHETIC": "0",
                "ATLAS_EMBED_SAMPLE": "1500",
                "ATLAS_EMBED_SAMPLE_MODULO": "200",
                "ATLAS_EMBED_MAX_CHARS": "768",
                "ATLAS_EMBED_BATCH_SIZE": "8",
                "ATLAS_EMBED_GROWTH_ENABLED": "1",
                "ATLAS_EMBED_GROWTH_MODULO": "20000",
                "ATLAS_EMBED_GROWTH_STEP": "5",
                "ATLAS_EMBED_GROWTH_SLEEP_SECONDS": "45",
                "ATLAS_LLAMACPP_CTX_SIZE": "4096",
                "ATLAS_LLAMACPP_BATCH_SIZE": "256",
                "ATLAS_LLAMACPP_STARTUP_TIMEOUT": "120",
            },
        ),
        RuntimeProfile(
            name="single_gpu_dev",
            score=30,
            min_gpu_count=1,
            min_gpu_memory_gb=16.0,
            gpu_name_patterns=(),
            notes="Single modern GPU workstation",
            env={
                "ATLAS_USE_SYNTHETIC": "0",
                "ATLAS_EMBED_SAMPLE": "8000",
                "ATLAS_EMBED_SAMPLE_MODULO": "120",
                "ATLAS_EMBED_MAX_CHARS": "1024",
                "ATLAS_EMBED_BATCH_SIZE": "16",
                "ATLAS_EMBED_GROWTH_ENABLED": "1",
                "ATLAS_EMBED_GROWTH_MODULO": "10000",
                "ATLAS_EMBED_GROWTH_STEP": "10",
                "ATLAS_EMBED_GROWTH_SLEEP_SECONDS": "20",
                "ATLAS_LLAMACPP_CTX_SIZE": "8192",
                "ATLAS_LLAMACPP_BATCH_SIZE": "512",
                "ATLAS_LLAMACPP_STARTUP_TIMEOUT": "120",
            },
        ),
        RuntimeProfile(
            name="rtx4090_x6",
            score=60,
            min_gpu_count=6,
            min_gpu_memory_gb=20.0,
            gpu_name_patterns=("4090",),
            notes="High-throughput 6x RTX 4090 class host",
            env={
                "ATLAS_USE_SYNTHETIC": "0",
                "ATLAS_EMBED_SAMPLE": "80000",
                "ATLAS_EMBED_SAMPLE_MODULO": "30",
                "ATLAS_EMBED_MAX_CHARS": "2048",
                "ATLAS_EMBED_BATCH_SIZE": "64",
                "ATLAS_EMBED_GROWTH_ENABLED": "1",
                "ATLAS_EMBED_GROWTH_MODULO": "8000",
                "ATLAS_EMBED_GROWTH_STEP": "40",
                "ATLAS_EMBED_GROWTH_SLEEP_SECONDS": "10",
                "ATLAS_LLAMACPP_CTX_SIZE": "12288",
                "ATLAS_LLAMACPP_BATCH_SIZE": "512",
                "ATLAS_LLAMACPP_STARTUP_TIMEOUT": "180",
            },
        ),
        RuntimeProfile(
            name="h100_x8",
            score=80,
            min_gpu_count=8,
            min_gpu_memory_gb=70.0,
            gpu_name_patterns=("H100",),
            notes="Datacenter 8x H100 class host",
            env={
                "ATLAS_USE_SYNTHETIC": "0",
                "ATLAS_EMBED_SAMPLE": "220000",
                "ATLAS_EMBED_SAMPLE_MODULO": "12",
                "ATLAS_EMBED_MAX_CHARS": "3072",
                "ATLAS_EMBED_BATCH_SIZE": "128",
                "ATLAS_EMBED_GROWTH_ENABLED": "1",
                "ATLAS_EMBED_GROWTH_MODULO": "6000",
                "ATLAS_EMBED_GROWTH_STEP": "80",
                "ATLAS_EMBED_GROWTH_SLEEP_SECONDS": "6",
                "ATLAS_LLAMACPP_CTX_SIZE": "16384",
                "ATLAS_LLAMACPP_BATCH_SIZE": "1024",
                "ATLAS_LLAMACPP_STARTUP_TIMEOUT": "240",
            },
        ),
        RuntimeProfile(
            name="blackwell_x8",
            score=90,
            min_gpu_count=8,
            min_gpu_memory_gb=90.0,
            gpu_name_patterns=("BLACKWELL", "B200", "GB200", "B100"),
            notes="Datacenter Blackwell class host",
            env={
                "ATLAS_USE_SYNTHETIC": "0",
                "ATLAS_EMBED_SAMPLE": "320000",
                "ATLAS_EMBED_SAMPLE_MODULO": "8",
                "ATLAS_EMBED_MAX_CHARS": "4096",
                "ATLAS_EMBED_BATCH_SIZE": "192",
                "ATLAS_EMBED_GROWTH_ENABLED": "1",
                "ATLAS_EMBED_GROWTH_MODULO": "8000",
                "ATLAS_EMBED_GROWTH_STEP": "140",
                "ATLAS_EMBED_GROWTH_SLEEP_SECONDS": "4",
                "ATLAS_LLAMACPP_CTX_SIZE": "32768",
                "ATLAS_LLAMACPP_BATCH_SIZE": "1536",
                "ATLAS_LLAMACPP_STARTUP_TIMEOUT": "300",
            },
        ),
    ]


def profile_is_eligible(snapshot: HardwareSnapshot, profile: RuntimeProfile) -> bool:
    if len(snapshot.gpus) < profile.min_gpu_count:
        return False

    if profile.min_gpu_count > 0:
        if not snapshot.gpus:
            return False
        min_observed_memory = min(gpu.memory_gb for gpu in snapshot.gpus)
        if min_observed_memory < profile.min_gpu_memory_gb:
            return False

    if profile.gpu_name_patterns and snapshot.gpus:
        names = " ".join(gpu.name.upper() for gpu in snapshot.gpus)
        if not any(pattern.upper() in names for pattern in profile.gpu_name_patterns):
            return False

    return True


def select_profile(snapshot: HardwareSnapshot, profiles: list[RuntimeProfile]) -> RuntimeProfile:
    model = cp_model.CpModel()
    vars_by_name = {p.name: model.NewBoolVar(p.name) for p in profiles}

    for profile in profiles:
        if not profile_is_eligible(snapshot, profile):
            model.Add(vars_by_name[profile.name] == 0)

    model.Add(sum(vars_by_name.values()) == 1)
    model.Maximize(sum(profile.score * vars_by_name[profile.name] for profile in profiles))

    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 2.0
    status = solver.Solve(model)

    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        return next(p for p in profiles if p.name == "laptop")

    for profile in profiles:
        if solver.Value(vars_by_name[profile.name]) == 1:
            return profile

    return next(p for p in profiles if p.name == "laptop")


def to_hocon(snapshot: HardwareSnapshot, profile: RuntimeProfile, source_template: Path) -> str:
    rendered = {
        "atlasRuntime": {
            "generatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
            "templatePath": str(source_template),
            "selectedProfile": profile.name,
            "notes": profile.notes,
            "environment": {
                "hostname": snapshot.hostname,
                "os": snapshot.os,
                "arch": snapshot.arch,
                "cpuLogicalCores": snapshot.cpu_logical_cores,
                "ramGb": snapshot.ram_gb,
                "gpuCount": len(snapshot.gpus),
                "gpus": [
                    {"name": gpu.name, "memoryGb": gpu.memory_gb} for gpu in snapshot.gpus
                ],
            },
            "recommendedEnv": profile.env,
            "usage": {
                "devenvUp": "devenv up",
                "devenvUpWithEnv": " ".join(f"{k}={v}" for k, v in profile.env.items()) + " devenv up",
            },
        }
    }

    config = ConfigFactory.from_dict(rendered)
    return HOCONConverter.to_hocon(config)


def write_env_defaults(path: Path, profile: RuntimeProfile) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Auto-generated by scripts/bootstrap_runtime_config.py",
        "# shellcheck shell=sh",
        "",
    ]
    for key, value in profile.env.items():
        escaped = value.replace('"', '\\"')
        lines.append(f': "${{{key}:={escaped}}}"')
        lines.append(f'export {key}')
    lines.append("")
    path.write_text("\n".join(lines))


def source_fingerprint(path: Path) -> dict:
    stat = path.stat()
    return {
        "path": str(path),
        "size": stat.st_size,
        "mtime_ns": stat.st_mtime_ns,
    }


def wait_for_models_endpoint(models_url: str, timeout_seconds: int) -> None:
    import urllib.error
    import urllib.request

    start = time.time()
    while time.time() - start < timeout_seconds:
        try:
            with urllib.request.urlopen(models_url, timeout=3) as resp:
                if resp.status == 200:
                    return
        except (urllib.error.URLError, TimeoutError):
            time.sleep(1)

    raise RuntimeError(f"Timed out waiting for llama endpoint: {models_url}")


def compute_embedding_pool_stats(
    input_dataset: Path,
    aperture_modulo: int,
    aperture_threshold: int,
) -> dict:
    import duckdb

    con = duckdb.connect(database=":memory:")
    try:
        total_rows = int(
            con.execute("SELECT COUNT(*) FROM read_parquet(?)", [str(input_dataset)]).fetchone()[0]
        )
        included_rows = int(
            con.execute(
                "SELECT COUNT(*) FROM read_parquet(?) WHERE hash(embedding_text) % ? < ?",
                [str(input_dataset), aperture_modulo, aperture_threshold],
            ).fetchone()[0]
        )

        columns = {
            row[0]
            for row in con.execute("DESCRIBE SELECT * FROM read_parquet(?)", [str(input_dataset)]).fetchall()
        }

        total_groups = None
        included_groups = None
        if "zip_file" in columns:
            total_groups = int(
                con.execute("SELECT COUNT(DISTINCT zip_file) FROM read_parquet(?)", [str(input_dataset)]).fetchone()[0]
            )
            included_groups = int(
                con.execute(
                    "SELECT COUNT(DISTINCT zip_file) FROM read_parquet(?) WHERE hash(embedding_text) % ? < ?",
                    [str(input_dataset), aperture_modulo, aperture_threshold],
                ).fetchone()[0]
            )

        return {
            "totalRows": total_rows,
            "includedRows": included_rows,
            "remainingRows": max(0, total_rows - included_rows),
            "totalGroups": total_groups,
            "includedGroups": included_groups,
            "remainingGroups": (
                max(0, total_groups - included_groups)
                if total_groups is not None and included_groups is not None
                else None
            ),
        }
    finally:
        con.close()


def generate_embeddings_dataset(
    input_dataset: Path,
    output_dataset: Path,
    metadata_manifest: Path,
    lock_file: Path,
    api_base: str,
    model: str,
    sample: int | None,
    sample_modulo: int,
    max_chars: int,
    embed_batch_size: int,
    startup_timeout: int,
    aperture_threshold: int | None = None,
    progress_prefix: str = "[bootstrap]",
) -> bool:
    import duckdb
    import fcntl
    import numpy as np
    import pandas as pd
    import pyarrow as pa
    import pyarrow.parquet as pq
    import umap
    from litellm import embedding

    if not input_dataset.exists():
        raise FileNotFoundError(f"Input dataset not found: {input_dataset}")

    run_spec = {
        "source": source_fingerprint(input_dataset),
        "apiBase": api_base.rstrip("/"),
        "model": model,
        "sample": sample,
        "sampleModulo": sample_modulo,
        "apertureThreshold": aperture_threshold,
        "maxChars": max_chars,
        "embedBatchSize": embed_batch_size,
        "version": 1,
    }
    run_digest = hashlib.sha256(json.dumps(run_spec, sort_keys=True).encode("utf-8")).hexdigest()

    lock_file.parent.mkdir(parents=True, exist_ok=True)
    with lock_file.open("w") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)

        if metadata_manifest.exists() and output_dataset.exists():
            try:
                manifest = json.loads(metadata_manifest.read_text())
                if manifest.get("digest") == run_digest:
                    print(f"{progress_prefix} embeddings output already up-to-date: {output_dataset}")
                    return False
            except json.JSONDecodeError:
                pass

        models_url = f"{api_base.rstrip('/')}/models"
        wait_for_models_endpoint(models_url=models_url, timeout_seconds=startup_timeout)

        if aperture_threshold is None:
            query = (
                "SELECT * REPLACE (substring(embedding_text, 1, ?) AS embedding_text) "
                "FROM read_parquet(?) "
                "WHERE hash(embedding_text) % ? = 0 "
                "LIMIT ?"
            )
            query_params = [max_chars, str(input_dataset), sample_modulo, sample or 0]
        else:
            query = (
                "SELECT * REPLACE (substring(embedding_text, 1, ?) AS embedding_text) "
                "FROM read_parquet(?) "
                "WHERE hash(embedding_text) % ? < ?"
            )
            query_params = [max_chars, str(input_dataset), sample_modulo, aperture_threshold]
            if sample is not None and sample > 0:
                query += " LIMIT ?"
                query_params.append(sample)

        con = duckdb.connect(database=":memory:")
        sampled_df = con.execute(query, query_params).fetch_df()
        con.close()

        if sampled_df.empty:
            raise RuntimeError("No rows selected for embedding generation. Adjust sampling settings.")

        texts = sampled_df["embedding_text"].fillna("").astype(str).tolist()
        vectors: list[list[float]] = []
        for i in range(0, len(texts), embed_batch_size):
            batch = texts[i : i + embed_batch_size]
            resp = embedding(
                input=batch,
                model=model,
                api_base=api_base,
                api_key="dummy",
                encoding_format="float",
            )
            vectors.extend([item["embedding"] for item in resp.data])

        vec_array = np.asarray(vectors, dtype=np.float32)
        proj = umap.UMAP(n_neighbors=15, min_dist=0.1, metric="cosine", random_state=42).fit_transform(vec_array)
        sampled_df["projection_x"] = proj[:, 0].astype(float)
        sampled_df["projection_y"] = proj[:, 1].astype(float)

        output_dataset.parent.mkdir(parents=True, exist_ok=True)
        temp_out = output_dataset.with_suffix(output_dataset.suffix + ".part")
        pq.write_table(pa.Table.from_pandas(sampled_df), temp_out)
        temp_out.replace(output_dataset)

        metadata_manifest.parent.mkdir(parents=True, exist_ok=True)
        metadata_manifest.write_text(
            json.dumps(
                {
                    "digest": run_digest,
                    "generatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
                    "rows": int(len(sampled_df)),
                    "config": run_spec,
                    "output": str(output_dataset),
                },
                indent=2,
            )
        )
        print(f"{progress_prefix} generated embeddings dataset: {output_dataset} ({len(sampled_df)} rows)")
        return True


def run_growth_cycle(
    input_dataset: Path,
    output_dataset: Path,
    metadata_manifest: Path,
    lock_file: Path,
    growth_state: Path,
    api_base: str,
    model: str,
    aperture_modulo: int,
    growth_step: int,
    growth_max_threshold: int,
    max_chars: int,
    embed_batch_size: int,
    startup_timeout: int,
) -> dict:
    prev_state: dict = {}
    if growth_state.exists():
        try:
            prev_state = json.loads(growth_state.read_text())
        except json.JSONDecodeError:
            prev_state = {}

    prev_threshold = int(prev_state.get("activeThreshold", 0))
    target_threshold = min(growth_max_threshold, max(0, prev_threshold + growth_step))

    if target_threshold <= prev_threshold:
        stats = compute_embedding_pool_stats(input_dataset, aperture_modulo, prev_threshold)
        print(
            f"[embedder] coverage complete at aperture {prev_threshold}/{aperture_modulo} | "
            f"rows {stats['includedRows']}/{stats['totalRows']} remaining={stats['remainingRows']}"
        )
        return {
            "changed": False,
            "activeThreshold": prev_threshold,
            "stats": stats,
            "status": "complete",
        }

    print(
        f"[embedder] cycle planning: aperture {prev_threshold}->{target_threshold}/{aperture_modulo}",
        flush=True,
    )

    prev_rows = int(prev_state.get("includedRows", 0))
    prev_groups = (
        int(prev_state.get("includedGroups", 0))
        if prev_state.get("includedGroups") is not None
        else None
    )
    target_stats = compute_embedding_pool_stats(input_dataset, aperture_modulo, target_threshold)

    target_new_rows = max(0, target_stats["includedRows"] - prev_rows)
    target_groups_suffix = ""
    if target_stats["totalGroups"] is not None:
        target_new_groups = max(0, (target_stats["includedGroups"] or 0) - int(prev_groups or 0))
        target_groups_suffix = (
            f" | groups +{target_new_groups}"
            f" ({target_stats['includedGroups']}/{target_stats['totalGroups']} remaining={target_stats['remainingGroups']})"
        )

    print(
        f"[embedder] cycle start: aperture {prev_threshold}->{target_threshold}/{aperture_modulo} | "
        f"target rows +{target_new_rows}"
        f" ({target_stats['includedRows']}/{target_stats['totalRows']} remaining={target_stats['remainingRows']})"
        f"{target_groups_suffix}"
    )

    changed = generate_embeddings_dataset(
        input_dataset=input_dataset,
        output_dataset=output_dataset,
        metadata_manifest=metadata_manifest,
        lock_file=lock_file,
        api_base=api_base,
        model=model,
        sample=None,
        sample_modulo=aperture_modulo,
        aperture_threshold=target_threshold,
        max_chars=max_chars,
        embed_batch_size=embed_batch_size,
        startup_timeout=startup_timeout,
        progress_prefix="[embedder]",
    )

    stats = target_stats
    new_rows = target_new_rows

    growth_state.parent.mkdir(parents=True, exist_ok=True)
    growth_state.write_text(
        json.dumps(
            {
                "updatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
                "apertureModulo": aperture_modulo,
                "activeThreshold": target_threshold,
                "growthStep": growth_step,
                "includedRows": stats["includedRows"],
                "remainingRows": stats["remainingRows"],
                "totalRows": stats["totalRows"],
                "includedGroups": stats["includedGroups"],
                "remainingGroups": stats["remainingGroups"],
                "totalGroups": stats["totalGroups"],
            },
            indent=2,
        )
    )

    groups_suffix = ""
    if stats["totalGroups"] is not None:
        groups_suffix = (
            f" | groups +{max(0, (stats['includedGroups'] or 0) - int(prev_state.get('includedGroups', 0) or 0))} "
            f"({stats['includedGroups']}/{stats['totalGroups']} remaining={stats['remainingGroups']})"
        )

    print(
        f"[embedder] aperture {target_threshold}/{aperture_modulo} | "
        f"rows +{new_rows} ({stats['includedRows']}/{stats['totalRows']} remaining={stats['remainingRows']})"
        f"{groups_suffix}"
    )

    return {
        "changed": changed,
        "activeThreshold": target_threshold,
        "stats": stats,
        "status": "ok",
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Evaluate local hardware and generate optimized runtime HOCON settings for Embedding Atlas."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("build/runtime.generated.conf"),
        help="Output HOCON file path.",
    )
    parser.add_argument(
        "--template",
        type=Path,
        default=Path("config/runtime.template.conf"),
        help="Template HOCON path used for reference.",
    )
    parser.add_argument(
        "--print-json",
        action="store_true",
        help="Also print selected profile and environment as JSON.",
    )
    parser.add_argument(
        "--env-output",
        type=Path,
        default=Path("build/runtime.generated.env"),
        help="Output shell env snippet with profile defaults.",
    )
    parser.add_argument(
        "--generate-embeddings",
        action="store_true",
        help="Generate idempotent embedded dataset with projection_x/projection_y.",
    )
    parser.add_argument(
        "--input-dataset",
        type=Path,
        default=Path("build/datasets/gittables_metadata.parquet"),
        help="Input parquet for embedding generation.",
    )
    parser.add_argument(
        "--embedded-output",
        type=Path,
        default=Path("build/datasets/gittables_metadata_embedded.parquet"),
        help="Output parquet with precomputed projection columns.",
    )
    parser.add_argument(
        "--embedded-manifest",
        type=Path,
        default=Path("build/datasets/gittables_metadata_embedded.manifest.json"),
        help="Manifest file used for idempotence checks.",
    )
    parser.add_argument(
        "--lock-file",
        type=Path,
        default=Path("build/bootstrap_embeddings.lock"),
        help="File lock path to serialize embedding generation.",
    )
    parser.add_argument(
        "--grow-embeddings-once",
        action="store_true",
        help="Advance aperture by one growth step and regenerate embedded dataset.",
    )
    parser.add_argument(
        "--growth-state",
        type=Path,
        default=Path("build/datasets/gittables_embedding_growth_state.json"),
        help="State file tracking background aperture growth progress.",
    )
    parser.add_argument(
        "--growth-modulo",
        type=int,
        default=20000,
        help="Modulo base used by deterministic aperture growth.",
    )
    parser.add_argument(
        "--growth-step",
        type=int,
        default=5,
        help="How many aperture buckets to add per growth cycle.",
    )
    parser.add_argument(
        "--growth-max-threshold",
        type=int,
        default=None,
        help="Cap for aperture threshold. Defaults to growth-modulo.",
    )
    args = parser.parse_args()

    snapshot = collect_snapshot()
    profiles = build_profiles()
    profile = select_profile(snapshot, profiles)

    hocon = to_hocon(snapshot, profile, args.template)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(hocon)
    write_env_defaults(args.env_output, profile)

    print(f"Wrote optimized runtime config: {args.output}")
    print(f"Wrote runtime env defaults: {args.env_output}")
    print(f"Selected profile: {profile.name}")
    print("Recommended env overrides for devenv up:")
    for key, value in profile.env.items():
        print(f"  {key}={value}")

    if args.print_json:
        print(
            json.dumps(
                {
                    "selectedProfile": profile.name,
                    "recommendedEnv": profile.env,
                    "gpuCount": len(snapshot.gpus),
                    "gpus": [gpu.__dict__ for gpu in snapshot.gpus],
                },
                indent=2,
            )
        )

    if args.generate_embeddings:
        env = {**profile.env}
        api_base = os.getenv("ATLAS_LLAMACPP_API_BASE", "http://localhost:8080/v1")
        model = os.getenv(
            "ATLAS_LLAMACPP_LITELLM_MODEL",
            f"openai/{os.getenv('ATLAS_LLAMACPP_MODEL', 'text-embedding')}",
        )
        sample = int(os.getenv("ATLAS_EMBED_SAMPLE", env["ATLAS_EMBED_SAMPLE"]))
        sample_modulo = int(os.getenv("ATLAS_EMBED_SAMPLE_MODULO", env["ATLAS_EMBED_SAMPLE_MODULO"]))
        max_chars = int(os.getenv("ATLAS_EMBED_MAX_CHARS", env["ATLAS_EMBED_MAX_CHARS"]))
        embed_batch_size = int(os.getenv("ATLAS_EMBED_BATCH_SIZE", env["ATLAS_EMBED_BATCH_SIZE"]))
        startup_timeout = int(
            os.getenv("ATLAS_LLAMACPP_STARTUP_TIMEOUT", env["ATLAS_LLAMACPP_STARTUP_TIMEOUT"])
        )

        generate_embeddings_dataset(
            input_dataset=args.input_dataset,
            output_dataset=args.embedded_output,
            metadata_manifest=args.embedded_manifest,
            lock_file=args.lock_file,
            api_base=api_base,
            model=model,
            sample=sample,
            sample_modulo=sample_modulo,
            max_chars=max_chars,
            embed_batch_size=embed_batch_size,
            startup_timeout=startup_timeout,
        )

    if args.grow_embeddings_once:
        env = {**profile.env}
        api_base = os.getenv("ATLAS_LLAMACPP_API_BASE", "http://localhost:8080/v1")
        model = os.getenv(
            "ATLAS_LLAMACPP_LITELLM_MODEL",
            f"openai/{os.getenv('ATLAS_LLAMACPP_MODEL', 'text-embedding')}",
        )
        max_chars = int(os.getenv("ATLAS_EMBED_MAX_CHARS", env["ATLAS_EMBED_MAX_CHARS"]))
        embed_batch_size = int(os.getenv("ATLAS_EMBED_BATCH_SIZE", env["ATLAS_EMBED_BATCH_SIZE"]))
        startup_timeout = int(
            os.getenv("ATLAS_LLAMACPP_STARTUP_TIMEOUT", env["ATLAS_LLAMACPP_STARTUP_TIMEOUT"])
        )

        growth_modulo = int(os.getenv("ATLAS_EMBED_GROWTH_MODULO", str(args.growth_modulo)))
        growth_step = int(os.getenv("ATLAS_EMBED_GROWTH_STEP", str(args.growth_step)))
        growth_max_threshold = int(
            os.getenv(
                "ATLAS_EMBED_GROWTH_MAX_THRESHOLD",
                str(args.growth_max_threshold if args.growth_max_threshold is not None else growth_modulo),
            )
        )

        run_growth_cycle(
            input_dataset=args.input_dataset,
            output_dataset=args.embedded_output,
            metadata_manifest=args.embedded_manifest,
            lock_file=args.lock_file,
            growth_state=args.growth_state,
            api_base=api_base,
            model=model,
            aperture_modulo=growth_modulo,
            growth_step=growth_step,
            growth_max_threshold=growth_max_threshold,
            max_chars=max_chars,
            embed_batch_size=embed_batch_size,
            startup_timeout=startup_timeout,
        )


if __name__ == "__main__":
    main()
