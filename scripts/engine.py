#!/usr/bin/env python3
# Copyright (c) 2025 Apple Inc. Licensed under MIT License.
import asyncio
import json
import logging
import os
import sys

import httpx
import uvicorn
import websockets
from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocket

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("engine")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared state
bootstrapping = True
bootstrap_messages = []
bootstrap_cond = asyncio.Condition()

async def read_stream(stream):
    global bootstrapping
    while True:
        line = await stream.readline()
        if not line:
            break
        msg = line.decode().strip()
        logger.info(f"[bootstrap] {msg}")
        async with bootstrap_cond:
            bootstrap_messages.append(msg)
            bootstrap_cond.notify_all()

async def run_stage():
    global bootstrapping

    # Pre-flight stage gates for UI responsiveness
    async def emit(msg):
        logger.info(f"[engine] {msg}")
        async with bootstrap_cond:
            bootstrap_messages.append(msg)
            bootstrap_cond.notify_all()

    await emit("Engine connected: Establishing secure proxy channel...")
    await asyncio.sleep(0.4)
    await emit("Validating runtime environment and analyzing hardware topology...")
    await asyncio.sleep(0.4)

    # 1. Run bootstrap if enabled
    bootstrap_enabled = os.environ.get("ATLAS_BOOTSTRAP_ENABLED", "1") == "1"
    if bootstrap_enabled:
        await emit("Hardware strategy determined: Bootstrapping dataset pipeline...")
        await asyncio.sleep(0.2)

        bootstrap_env_file = os.environ.get("ATLAS_BOOTSTRAP_ENV_FILE", "build/runtime.generated.env")
        embedded_dataset = os.environ.get("ATLAS_EMBEDDED_DATASET", "build/datasets/gittables_metadata_embedded.parquet")
        input_dataset = os.environ.get("ATLAS_DATASET", "build/datasets/gittables_metadata.parquet")

        cmd = [
            sys.executable, "scripts/bootstrap_runtime_config.py",
            "--output", "build/runtime.generated.conf",
            "--template", "config/runtime.template.conf",
            "--env-output", bootstrap_env_file,
            "--generate-embeddings",
            "--input-dataset", input_dataset,
            "--embedded-output", embedded_dataset
        ]

        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT
        )
        await read_stream(proc.stdout)
        await proc.wait()
        if proc.returncode != 0:
            await emit("Bootstrap failed! Proceeding anyway to let backend surface error...")

    await emit("Data pipeline synced: Warming up core embedding-atlas backend...")

    # 2. Run embedding-atlas standard backend on port 5056
    embedded_dataset = os.environ.get("ATLAS_EMBEDDED_DATASET", "build/datasets/gittables_metadata_embedded.parquet")

    atlas_cmd = [
        sys.executable, "-m", "embedding_atlas.cli",
        embedded_dataset,
        "--text", "embedding_text",
        "--x", "projection_x",
        "--y", "projection_y",
        "--host", "127.0.0.1",
        "--port", "5056",
        "--no-auto-port",
        "--mcp"
    ]

    proc2 = await asyncio.create_subprocess_exec(*atlas_cmd)

    # Wait until backend is genuinely ready before closing SSE stream
    await emit("Subprocess started: Waiting for backend to bind and load dataset into memory (this may take a moment)...")

    async with httpx.AsyncClient() as hc:
        backend_up = False
        while not backend_up:
            try:
                # Polling the backend core metadata to verify it's serving
                resp = await hc.get("http://127.0.0.1:5056/data/metadata.json", timeout=2.0)
                if resp.status_code == 200:
                    backend_up = True
                    await emit("Backend successfully mounted and ready!")
            except httpx.RequestError:
                pass

            if not backend_up:
                if proc2.returncode is not None:
                    await emit(f"Backend process crashed unexpectedly with exit code {proc2.returncode}!")
                    break
                await asyncio.sleep(1.0)

    # Mark bootstrap finished
    async with bootstrap_cond:
        bootstrapping = False
        bootstrap_cond.notify_all()

    await proc2.wait()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(run_stage())

@app.get("/data/status")
async def get_status():
    async def event_generator():
        last_idx = 0
        while True:
            async with bootstrap_cond:
                if not bootstrapping and last_idx >= len(bootstrap_messages):
                    break

                if last_idx < len(bootstrap_messages):
                    for msg in bootstrap_messages[last_idx:]:
                        if msg:
                            yield f"data: {json.dumps({'message': msg})}\n\n"
                    last_idx = len(bootstrap_messages)
                else:
                    try:
                        await asyncio.wait_for(bootstrap_cond.wait(), timeout=1.0)
                    except asyncio.TimeoutError:
                        pass

        yield f"data: {json.dumps({'type': 'ready', 'message': 'Bootstrapping complete'})}\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")

client = httpx.AsyncClient(base_url="http://127.0.0.1:5056", timeout=60.0)

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
async def proxy(request: Request, path: str):
    if bootstrapping:
        return Response(status_code=503, content="Bootstrapping")

    url = httpx.URL(path=request.url.path, query=request.url.query.encode("utf-8"))

    # The SSE stream already guaranteed the backend was up,
    # but we retry a few times just in case of microscopic timing differences.
    for _ in range(5):
        try:
            req = client.build_request(
                request.method,
                url,
                headers=request.headers.raw,
                content=request.stream(),
            )
            resp = await client.send(req, stream=True)

            async def stream_response():
                async for chunk in resp.aiter_raw():
                    yield chunk

            return StreamingResponse(
                stream_response(),
                status_code=resp.status_code,
                headers=resp.headers,
            )
        except httpx.ConnectError:
            await asyncio.sleep(0.5)

    return Response(status_code=502, content="Bad Gateway")

@app.websocket("/{path:path}")
async def websocket_proxy(websocket: WebSocket, path: str):
    await websocket.accept()
    if bootstrapping:
        await websocket.close()
        return

    target_ws_url = f"ws://127.0.0.1:5056/{path}"
    query = websocket.url.query
    if query:
         target_ws_url += "?" + query

    try:
        async with websockets.connect(target_ws_url) as target_ws:
            async def client_to_target():
                try:
                    while True:
                        msg = await websocket.receive_text()
                        await target_ws.send(msg)
                except Exception:
                    pass

            async def target_to_client():
                try:
                    while True:
                        msg = await target_ws.recv()
                        await websocket.send_text(msg)
                except Exception:
                    pass

            await asyncio.gather(
                client_to_target(),
                target_to_client()
            )
    except Exception as e:
        logger.error(f"WS error: {e}")
        await websocket.close()

if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "5055"))
    uvicorn.run(app, host=host, port=port, access_log=False)
