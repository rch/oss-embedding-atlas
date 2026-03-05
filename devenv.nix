{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/packages/
  packages = [
    pkgs.git
    pkgs.llama-cpp
    pkgs.curl
  ];

  # https://devenv.sh/languages/
  # languages.rust.enable = true;

  languages.python = {
    enable = true;
    package = pkgs.python314;
    uv.enable = true;
    #uv.sync.enable = true;
    # PyFlink is now a core dependency (not an extra).
    # The k8s extra (dask) is compatible with flink after patching thirdparty/flink.
    #uv.sync.allExtras = false;
    #uv.sync.extras = ["dev"];
    venv.enable = true;
  };

  languages.java = {
    enable = true;
    jdk.package = pkgs.jdk21;  # NiFi 2.0 requires Java 21+
    maven.enable = true;
  };

  languages.javascript = {
    enable = true;
    directory = ".";
    npm = {
      enable = true;
      install.enable = true;
    };
  };

  # https://devenv.sh/processes/
  processes.viewer.exec = ''
    set -euo pipefail

    # Ensure bootstrap has litellm/duckdb/umap dependencies available.
    uv pip install --python .devenv/state/venv/bin/python -e ./packages/backend

    BOOTSTRAP_ENABLED=''${ATLAS_BOOTSTRAP_ENABLED:-1}
    BOOTSTRAP_ENV_FILE=''${ATLAS_BOOTSTRAP_ENV_FILE:-build/runtime.generated.env}
    EMBEDDED_DATASET=''${ATLAS_EMBEDDED_DATASET:-build/datasets/gittables_metadata_embedded.parquet}

    if [ "$BOOTSTRAP_ENABLED" = "1" ]; then
      .devenv/state/venv/bin/python scripts/bootstrap_runtime_config.py \
        --output build/runtime.generated.conf \
        --template config/runtime.template.conf \
        --env-output "$BOOTSTRAP_ENV_FILE" \
        --generate-embeddings \
        --input-dataset ''${ATLAS_DATASET:-build/datasets/gittables_metadata.parquet} \
        --embedded-output "$EMBEDDED_DATASET"

      if [ -f "$BOOTSTRAP_ENV_FILE" ]; then
        # shellcheck disable=SC1090
        . "$BOOTSTRAP_ENV_FILE"
      fi

      EMBEDDED_DATASET=''${ATLAS_EMBEDDED_DATASET:-$EMBEDDED_DATASET}
    fi

    if [ ! -f "$EMBEDDED_DATASET" ]; then
      echo "[viewer] embedded dataset missing after bootstrap: $EMBEDDED_DATASET" >&2
      exit 1
    fi

    # Build workspace packages required by @embedding-atlas/viewer imports.
    npm run package -w @embedding-atlas/utils
    npm run package -w @embedding-atlas/component

    npm run dev -w @embedding-atlas/viewer -- --host 127.0.0.1 --port 5173
  '';

  processes.llama.exec = ''
    set -euo pipefail

    BOOTSTRAP_ENABLED=''${ATLAS_BOOTSTRAP_ENABLED:-1}
    BOOTSTRAP_ENV_FILE=''${ATLAS_BOOTSTRAP_ENV_FILE:-build/runtime.generated.env}
    if [ "$BOOTSTRAP_ENABLED" = "1" ]; then
      if ! .devenv/state/venv/bin/python scripts/bootstrap_runtime_config.py --output build/runtime.generated.conf --template config/runtime.template.conf --env-output "$BOOTSTRAP_ENV_FILE" >/tmp/atlas_bootstrap_llama.log 2>&1; then
        echo "[llama] bootstrap warning: failed to generate runtime config (continuing)" >&2
      fi
      if [ -f "$BOOTSTRAP_ENV_FILE" ]; then
        # shellcheck disable=SC1090
        . "$BOOTSTRAP_ENV_FILE"
      fi
    fi

    MODEL_DIR=''${ATLAS_LLAMACPP_MODEL_DIR:-build/models}
    MODEL_FILE=''${ATLAS_LLAMACPP_MODEL_FILE:-nomic-embed-text-v1.5.Q4_K_M.gguf}
    MODEL_URL=''${ATLAS_LLAMACPP_MODEL_URL:-https://huggingface.co/nomic-ai/nomic-embed-text-v1.5-GGUF/resolve/main/nomic-embed-text-v1.5.Q4_K_M.gguf?download=true}
    MODEL_PATH="$MODEL_DIR/$MODEL_FILE"

    mkdir -p "$MODEL_DIR"

    if [ ! -f "$MODEL_PATH" ]; then
      echo "[llama] Downloading embedding model to $MODEL_PATH"
      if ! curl -fL --retry 3 --retry-delay 2 -o "$MODEL_PATH.part" "$MODEL_URL"; then
        rm -f "$MODEL_PATH.part"
        echo "[llama] Failed to download model from $MODEL_URL" >&2
        echo "[llama] Set ATLAS_LLAMACPP_MODEL_URL or place a GGUF at $MODEL_PATH" >&2
        echo "[llama] Process idle (no restart loop)." >&2
        while true; do sleep 3600; done
      fi
      mv "$MODEL_PATH.part" "$MODEL_PATH"
    fi

    echo "[llama] Starting llama-server on http://127.0.0.1:8080 with model $MODEL_PATH"
    llama-server \
      --model "$MODEL_PATH" \
      --alias text-embedding \
      --embedding \
      --host 127.0.0.1 \
      --port 8080 \
      --ctx-size ''${ATLAS_LLAMACPP_CTX_SIZE:-4096} \
      --batch-size ''${ATLAS_LLAMACPP_BATCH_SIZE:-128}
  '';

  processes.backend.exec = ''
    set -euo pipefail

    # Ensure editable backend CLI and dependencies are installed in devenv venv.
    uv pip install --python .devenv/state/venv/bin/python -e ./packages/backend

    BOOTSTRAP_ENABLED=''${ATLAS_BOOTSTRAP_ENABLED:-1}
    BOOTSTRAP_ENV_FILE=''${ATLAS_BOOTSTRAP_ENV_FILE:-build/runtime.generated.env}
    EMBEDDED_DATASET=''${ATLAS_EMBEDDED_DATASET:-build/datasets/gittables_metadata_embedded.parquet}
    if [ "$BOOTSTRAP_ENABLED" = "1" ]; then
      .devenv/state/venv/bin/python scripts/bootstrap_runtime_config.py \
        --output build/runtime.generated.conf \
        --template config/runtime.template.conf \
        --env-output "$BOOTSTRAP_ENV_FILE" \
        --generate-embeddings \
        --input-dataset ''${ATLAS_DATASET:-build/datasets/gittables_metadata.parquet} \
        --embedded-output "$EMBEDDED_DATASET"

      if [ -f "$BOOTSTRAP_ENV_FILE" ]; then
        # shellcheck disable=SC1090
        . "$BOOTSTRAP_ENV_FILE"
      fi

      EMBEDDED_DATASET=''${ATLAS_EMBEDDED_DATASET:-$EMBEDDED_DATASET}
    fi

    DATASET="$EMBEDDED_DATASET"
    if [ ! -f "$DATASET" ]; then
      echo "[backend] embedded dataset missing after bootstrap: $DATASET" >&2
      exit 1
    fi

    echo "[backend] serving precomputed real-embeddings dataset: $DATASET"
    .devenv/state/venv/bin/embedding-atlas \
      "$DATASET" \
      --text embedding_text \
      --x projection_x \
      --y projection_y \
      --host localhost \
      --port 5055 \
      --no-auto-port \
      --cors http://127.0.0.1:5173,http://localhost:5173 \
      --mcp
  '';

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
    git --version | grep --color=auto "${pkgs.git.version}"
  '';

  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
