import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const {
  DEFAULT_APP_PASSWORD,
  buildPortableEnv,
  ensurePortableConfig,
  toPrismaSqliteUrl,
} = require("../../desktop/runtime.cjs");

const tempDirs: string[] = [];

function createTempWorkspace() {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "portable-runtime-"));
  tempDirs.push(tempDir);

  return {
    appRoot: tempDir,
    resourcesRoot: tempDir,
    dataDir: path.join(tempDir, "data"),
    logsDir: path.join(tempDir, "data", "logs"),
    dbPath: path.join(tempDir, "data", "app.db"),
    configPath: path.join(tempDir, "data", "config.json"),
    schemaPath: path.join(tempDir, "prisma", "schema.prisma"),
    serverRoot: tempDir,
    dotEnvPath: path.join(tempDir, ".env"),
  };
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const tempDir = tempDirs.pop();

    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

describe("portable desktop runtime", () => {
  it("creates config.json with the bundled default password", () => {
    const workspace = createTempWorkspace();
    const config = ensurePortableConfig(workspace);
    const savedConfig = JSON.parse(readFileSync(workspace.configPath, "utf8"));

    expect(config.appPassword).toBe(DEFAULT_APP_PASSWORD);
    expect(savedConfig.appPassword).toBe(DEFAULT_APP_PASSWORD);
    expect(savedConfig.sessionSecret).toHaveLength(64);
  });

  it("builds runtime env from the portable config", () => {
    const workspace = createTempWorkspace();
    const config = ensurePortableConfig(workspace);
    const env = buildPortableEnv(workspace, config, {});

    expect(env.APP_PASSWORD).toBe(DEFAULT_APP_PASSWORD);
    expect(env.DATABASE_URL).toBe(toPrismaSqliteUrl(workspace.dbPath));
    expect(env.PORTABLE_APP_DATA_DIR).toBe(workspace.dataDir);
  });
});
