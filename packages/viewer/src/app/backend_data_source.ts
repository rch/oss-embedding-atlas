// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import type { Coordinator } from "@uwdata/mosaic-core";
import * as SQL from "@uwdata/mosaic-sql";

import type { EmbeddingAtlasProps } from "../api.js";
import { initializeDatabase } from "../utils/database.js";
import { downloadBuffer } from "../utils/download.js";
import { exportMosaicSelection, filenameForSelection, type ExportFormat } from "../utils/mosaic_exporter.js";
import type { DataSource } from "./data_source.js";
import { MCPWebSocketServer } from "./mcp_server.js";

function joinUrl(a: string, b: string) {
  if (b.startsWith(".")) {
    b = b.slice(1);
  }
  if (a.endsWith("/") && b.startsWith("/")) {
    return a + b.slice(1);
  } else if (!a.endsWith("/") && !b.startsWith("/")) {
    return a + "/" + b;
  } else {
    return a + b;
  }
}

interface Metadata {
  props: Partial<EmbeddingAtlasProps>;

  isStatic?: boolean;
  database?: {
    type: "wasm" | "socket" | "rest";
    uri?: string;
    load?: boolean;
    datasetUrl?: string;
  };

  mcp?: {
    type: "websocket";
  };
}

const METADATA_FETCH_MAX_ATTEMPTS = 30;
const METADATA_FETCH_INITIAL_DELAY_MS = 500;
const METADATA_FETCH_MAX_DELAY_MS = 5000;

export class BackendDataSource implements DataSource {
  private serverUrl: string;
  downloadArchive: (() => Promise<void>) | undefined = undefined;
  downloadSelection: ((predicate: string | null, format: ExportFormat) => Promise<void>) | undefined = undefined;

  constructor(serverUrl: string) {
    if (serverUrl.startsWith("http")) {
      this.serverUrl = serverUrl;
    } else {
      let pageUrl = window.location.origin + window.location.pathname;
      pageUrl = pageUrl.replace(/\/[^/]*$/, "/");
      this.serverUrl = joinUrl(pageUrl, serverUrl);
    }
  }

  async initializeCoordinator(
    coordinator: Coordinator,
    table: string,
    onStatus: (message: string) => void,
  ): Promise<Partial<EmbeddingAtlasProps>> {
    let metadata = await this.metadata(onStatus);

    onStatus("Initializing database...");
    let dbType = metadata.database?.type ?? "wasm";
    await initializeDatabase(coordinator, dbType, metadata.database?.uri ?? joinUrl(this.serverUrl, "query"));

    if (metadata.database?.load) {
      onStatus("Loading data...");
      let datasetUrl = metadata.database?.datasetUrl ?? joinUrl(this.serverUrl, "dataset.parquet");
      await coordinator.exec(`
        CREATE OR REPLACE TABLE ${table} AS (SELECT * FROM read_parquet(${SQL.literal(datasetUrl)}));
      `);
    }

    if (!metadata.isStatic) {
      this.downloadArchive = async () => {
        let resp = await this.fetchEndpoint("archive.zip");
        let data = await resp.arrayBuffer();
        downloadBuffer(data, "embedding-atlas.zip");
      };
    }

    if (dbType == "wasm") {
      this.downloadSelection = async (predicate, format) => {
        let [bytes, name] = await exportMosaicSelection(coordinator, table, predicate, format);
        downloadBuffer(bytes, name);
      };
    } else if (!metadata.isStatic) {
      this.downloadSelection = async (predicate, format) => {
        let name = filenameForSelection(format);
        let resp = await this.fetchEndpoint("selection", {
          method: "POST",
          body: JSON.stringify({ predicate: predicate, format: format }),
        });
        let data = await resp.arrayBuffer();
        downloadBuffer(data, name);
      };
    }

    if (metadata.mcp && metadata.mcp.type == "websocket") {
      metadata.props.modelContext = new MCPWebSocketServer(joinUrl(this.serverUrl, "mcp_websocket"));
    }

    return metadata.props;
  }

  private async fetchEndpoint(endpoint: string, init?: RequestInit) {
    let resp = await fetch(joinUrl(this.serverUrl, endpoint), init);
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} while fetching ${endpoint}`);
    }
    return resp;
  }

  private async wait(ms: number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async metadata(onStatus?: (message: string) => void): Promise<Metadata> {
    let lastError: unknown = null;
    let sseDone = false;

    for (let attempt = 1; attempt <= METADATA_FETCH_MAX_ATTEMPTS; attempt++) {
      try {
        if (!sseDone && onStatus) {
           try {
             let statusResp = await fetch(joinUrl(this.serverUrl, "status"));
             if (statusResp.ok && statusResp.body) {
                const reader = statusResp.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                while (true) {
                  const { value, done } = await reader.read();
                  if (done) break;
                  buffer += decoder.decode(value, { stream: true });
                  const lines = buffer.split("\n");
                  buffer = lines.pop() || "";
                  for (let line of lines) {
                    if (line.startsWith("data: ")) {
                      try {
                        let data = JSON.parse(line.slice(6));
                        if (data.type === "ready") {
                           sseDone = true;
                           break;
                        }
                        if (data.message) {
                           onStatus(data.message);
                        }
                      } catch (e) {} // ignore invalid JSON
                    }
                  }
                  if (sseDone) break;
                }
             }
           } catch (e) {
             // Ignore status endpoint errors (connection refused, not up yet)
           }
        }

        let resp = await this.fetchEndpoint("metadata.json");
        return await resp.json();
      } catch (e) {
        lastError = e;

        if (attempt === METADATA_FETCH_MAX_ATTEMPTS) {
          break;
        }

        let delayMs = Math.min(
          METADATA_FETCH_INITIAL_DELAY_MS * 2 ** (attempt - 1),
          METADATA_FETCH_MAX_DELAY_MS,
        );
        console.warn(
          `[viewer] metadata fetch failed (attempt ${attempt}/${METADATA_FETCH_MAX_ATTEMPTS}), retrying in ${delayMs}ms`,
          e,
        );
        await this.wait(delayMs);
      }
    }

    console.error("[viewer] metadata fetch failed after retries", lastError);
    throw new Error("Network Error: Failed to fetch dataset metadata");
  }

  async cacheGet(key: string) {
    try {
      return await this.fetchEndpoint("cache/" + key).then((x) => x.json());
    } catch (e) {
      return null;
    }
  }

  async cacheSet(key: string, value: any) {
    try {
      await this.fetchEndpoint("cache/" + key, {
        method: "POST",
        body: JSON.stringify(value),
      });
    } catch (e) {
      // Ignore set cache errors.
    }
  }

  cache = {
    get: (key: string) => this.cacheGet(key),
    set: (key: string, value: any) => this.cacheSet(key, value),
  };
}
