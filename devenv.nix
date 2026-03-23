{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/packages/
  packages = [
    pkgs.git
    pkgs.gh
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

    # Keep viewer startup fast; backend/embedder own runtime bootstrap and dataset generation.
    if [ ! -f packages/utils/dist/index.js ] || find packages/utils/src -type f -newer packages/utils/dist/index.js | grep -q .; then
      echo "[viewer] building @embedding-atlas/utils"
      npm run build -w @embedding-atlas/utils
    fi

    if [ ! -f packages/component/dist/index.js ] || find packages/component/src -type f -newer packages/component/dist/index.js | grep -q .; then
      echo "[viewer] building @embedding-atlas/component"
      npm run build -w @embedding-atlas/component
    fi

    npm run dev -w @embedding-atlas/viewer -- --host 127.0.0.1 --port 5173
  '';

  processes.ggml.exec = ''
    set -euo pipefail

    BOOTSTRAP_ENABLED=''${ATLAS_BOOTSTRAP_ENABLED:-1}
    BOOTSTRAP_ENV_FILE=''${ATLAS_BOOTSTRAP_ENV_FILE:-build/runtime.generated.env}
    if [ "$BOOTSTRAP_ENABLED" = "1" ]; then
      if ! .devenv/state/venv/bin/python scripts/bootstrap_runtime_config.py --output build/runtime.generated.conf --template config/runtime.template.conf --env-output "$BOOTSTRAP_ENV_FILE" >/tmp/atlas_bootstrap_ggml.log 2>&1; then
        echo "[ggml] bootstrap warning: failed to generate runtime config (continuing)" >&2
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
      echo "[ggml] Downloading embedding model to $MODEL_PATH"
      if ! curl -fL --retry 3 --retry-delay 2 -o "$MODEL_PATH.part" "$MODEL_URL"; then
        rm -f "$MODEL_PATH.part"
        echo "[ggml] Failed to download model from $MODEL_URL" >&2
        echo "[ggml] Set ATLAS_LLAMACPP_MODEL_URL or place a GGUF at $MODEL_PATH" >&2
        echo "[ggml] Process idle (no restart loop)." >&2
        while true; do sleep 3600; done
      fi
      mv "$MODEL_PATH.part" "$MODEL_PATH"
    fi

    echo "[ggml] Starting llama-server on http://127.0.0.1:8080 with model $MODEL_PATH"
    llama-server \
      --model "$MODEL_PATH" \
      --alias text-embedding \
      --embedding \
      --host 127.0.0.1 \
      --port 8080 \
      --ctx-size ''${ATLAS_LLAMACPP_CTX_SIZE:-4096} \
        --batch-size ''${ATLAS_LLAMACPP_BATCH_SIZE:-320}
  '';

  processes.backend.exec = ''
    set -euo pipefail

    # Ensure editable backend CLI and dependencies are installed in devenv venv.
    uv pip install --python .devenv/state/venv/bin/python -e ./packages/backend

    # Ensure engine dependencies
    uv pip install --python .devenv/state/venv/bin/python httpx websockets uvicorn fastapi starlette

    PORT=5055 .devenv/state/venv/bin/python scripts/engine.py
  '';

  processes.embedder.exec = ''
    set -euo pipefail

    # Ensure growth worker has backend embedding dependencies available.
    uv pip install --python .devenv/state/venv/bin/python -e ./packages/backend

    BOOTSTRAP_ENABLED=''${ATLAS_BOOTSTRAP_ENABLED:-1}
    BOOTSTRAP_ENV_FILE=''${ATLAS_BOOTSTRAP_ENV_FILE:-build/runtime.generated.env}
    INPUT_DATASET=''${ATLAS_DATASET:-build/datasets/gittables_metadata.parquet}
    EMBEDDED_DATASET=''${ATLAS_EMBEDDED_DATASET:-build/datasets/gittables_metadata_embedded.parquet}
    EMBEDDED_MANIFEST=''${ATLAS_EMBEDDED_MANIFEST:-build/datasets/gittables_metadata_embedded.manifest.json}
    EMBED_GROWTH_STATE=''${ATLAS_EMBED_GROWTH_STATE:-build/datasets/gittables_embedding_growth_state.json}
    EMBED_GROWTH_ENABLED=''${ATLAS_EMBED_GROWTH_ENABLED:-1}
    EMBED_GROWTH_SLEEP_SECONDS=''${ATLAS_EMBED_GROWTH_SLEEP_SECONDS:-45}

    if [ "$BOOTSTRAP_ENABLED" = "1" ]; then
      .devenv/state/venv/bin/python -u scripts/bootstrap_runtime_config.py \
        --output build/runtime.generated.conf \
        --template config/runtime.template.conf \
        --env-output "$BOOTSTRAP_ENV_FILE"

      if [ -f "$BOOTSTRAP_ENV_FILE" ]; then
        # shellcheck disable=SC1090
        . "$BOOTSTRAP_ENV_FILE"
      fi

      EMBEDDED_DATASET=''${ATLAS_EMBEDDED_DATASET:-$EMBEDDED_DATASET}
      EMBED_GROWTH_ENABLED=''${ATLAS_EMBED_GROWTH_ENABLED:-$EMBED_GROWTH_ENABLED}
      EMBED_GROWTH_SLEEP_SECONDS=''${ATLAS_EMBED_GROWTH_SLEEP_SECONDS:-$EMBED_GROWTH_SLEEP_SECONDS}
    fi

    if [ "$EMBED_GROWTH_ENABLED" != "1" ]; then
      echo "[embedder] background growth disabled (ATLAS_EMBED_GROWTH_ENABLED=$EMBED_GROWTH_ENABLED); idling"
      while true; do sleep 3600; done
    fi

    if [ ! -f "$INPUT_DATASET" ]; then
      echo "[embedder] input dataset not found at $INPUT_DATASET; idling" >&2
      while true; do sleep 3600; done
    fi

    echo "[embedder] starting continuous growth loop (sleep=$EMBED_GROWTH_SLEEP_SECONDS s)"
    while true; do
      if ! .devenv/state/venv/bin/python -u scripts/bootstrap_runtime_config.py \
        --output build/runtime.generated.conf \
        --template config/runtime.template.conf \
        --env-output "$BOOTSTRAP_ENV_FILE" \
        --grow-embeddings-once \
        --input-dataset "$INPUT_DATASET" \
        --embedded-output "$EMBEDDED_DATASET" \
        --embedded-manifest "$EMBEDDED_MANIFEST" \
        --growth-state "$EMBED_GROWTH_STATE"; then
        echo "[embedder] growth cycle failed; retrying in $EMBED_GROWTH_SLEEP_SECONDS s" >&2
      fi

      sleep "$EMBED_GROWTH_SLEEP_SECONDS"
    done
  '';

  scripts = {
    "workflow:build-release-assets" = {
      exec = ''
        set -euo pipefail

        VERSION=$(python - <<'PY'
from pathlib import Path
import tomllib

data = tomllib.loads(Path("packages/backend/pyproject.toml").read_text())
print(data["project"]["version"])
PY
)

        echo "[release] building backend wheel for version $VERSION"
        ./packages/backend/build.sh

        DIST_DIR="packages/backend/dist"
        WHEEL_GLOB="$DIST_DIR/embedding_atlas-$VERSION-*.whl"

        if ! ls $WHEEL_GLOB >/dev/null 2>&1; then
          echo "Error: expected wheel matching $WHEEL_GLOB" >&2
          exit 1
        fi

        shasum -a 256 $WHEEL_GLOB > "$DIST_DIR/checksums.txt"

        echo "[release] built artifacts:"
        ls -1 $WHEEL_GLOB "$DIST_DIR/checksums.txt"
      '';
    };

    "workflow:create-release" = {
      exec = ''
        set -euo pipefail

        EMBEDDING_ATLAS_RELEASE_REPO=''${EMBEDDING_ATLAS_RELEASE_REPO:-}
        EMBEDDING_ATLAS_RELEASE_TAG=''${EMBEDDING_ATLAS_RELEASE_TAG:-}

        if [ -z "$EMBEDDING_ATLAS_RELEASE_REPO" ]; then
          echo "Error: EMBEDDING_ATLAS_RELEASE_REPO is required. Example: rch/oss-embedding-atlas" >&2
          exit 1
        fi

        VERSION=$(python - <<'PY'
from pathlib import Path
import tomllib

data = tomllib.loads(Path("packages/backend/pyproject.toml").read_text())
print(data["project"]["version"])
PY
)

        TAG=''${EMBEDDING_ATLAS_RELEASE_TAG:-v$VERSION}
        DIST_DIR="packages/backend/dist"
        WHEEL_GLOB="$DIST_DIR/embedding_atlas-$VERSION-*.whl"

        if ! ls $WHEEL_GLOB >/dev/null 2>&1; then
          echo "[release] missing wheel for $VERSION; building now"
          devenv tasks run workflow:build-release-assets
        fi

        if [ ! -f "$DIST_DIR/checksums.txt" ]; then
          shasum -a 256 $WHEEL_GLOB > "$DIST_DIR/checksums.txt"
        fi

        # Keep release tag aligned with package version.
        if [ "$TAG" != "v$VERSION" ]; then
          echo "Error: release tag $TAG must match backend version v$VERSION" >&2
          exit 1
        fi

        git fetch --tags --quiet

        if ! git rev-parse -q --verify "refs/tags/$TAG" >/dev/null; then
          git tag -a "$TAG" -m "$TAG"
        fi

        if ! git ls-remote --tags origin "refs/tags/$TAG" | grep -q "$TAG"; then
          git push origin "$TAG"
        fi

        if gh release view "$TAG" --repo "$EMBEDDING_ATLAS_RELEASE_REPO" >/dev/null 2>&1; then
          gh release upload "$TAG" $WHEEL_GLOB "$DIST_DIR/checksums.txt" \
            --repo "$EMBEDDING_ATLAS_RELEASE_REPO" \
            --clobber
        else
          gh release create "$TAG" \
            --repo "$EMBEDDING_ATLAS_RELEASE_REPO" \
            --title "$TAG" \
            --generate-notes \
            --verify-tag \
            $WHEEL_GLOB "$DIST_DIR/checksums.txt"
        fi

        gh release view "$TAG" --repo "$EMBEDDING_ATLAS_RELEASE_REPO" --json tagName,assets,url
      '';
    };
  };

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
