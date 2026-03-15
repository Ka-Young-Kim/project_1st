/* eslint-disable @typescript-eslint/no-require-imports */
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_APP_PASSWORD = "changeme1234";
const DEFAULT_MARKET_DATA_CACHE_SECONDS = 30;

function ensureDirectory(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function ensureFile(targetPath) {
  if (fs.existsSync(targetPath)) {
    return;
  }

  fs.closeSync(fs.openSync(targetPath, "a"));
}

function appendLogFile(targetPath, content) {
  fs.appendFileSync(targetPath, content, "utf8");
}

function readJsonFile(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(targetPath, "utf8"));
  } catch {
    return null;
  }
}

function readDotEnvFile(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return {};
  }

  const lines = fs.readFileSync(targetPath, "utf8").split(/\r?\n/);
  const values = {};

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex < 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    values[key] = rawValue.replace(/^"(.*)"$/, "$1");
  }

  return values;
}

function getPortableAppRoot(isPackaged) {
  if (isPackaged) {
    return path.dirname(process.execPath);
  }

  return path.resolve(__dirname, "..");
}

function getPortablePaths(isPackaged) {
  const appRoot = getPortableAppRoot(isPackaged);
  const resourcesRoot = isPackaged ? process.resourcesPath : appRoot;
  const dataDir = path.join(appRoot, "data");
  const logsDir = path.join(dataDir, "logs");

  return {
    appRoot,
    resourcesRoot,
    dataDir,
    logsDir,
    dbPath: path.join(dataDir, "app.db"),
    configPath: path.join(dataDir, "config.json"),
    schemaPath: isPackaged
      ? path.join(resourcesRoot, "server", "prisma", "schema.prisma")
      : path.join(appRoot, "prisma", "schema.prisma"),
    serverRoot: isPackaged ? path.join(resourcesRoot, "server") : appRoot,
    dotEnvPath: path.join(appRoot, ".env"),
  };
}

function normalizeCacheSeconds(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return DEFAULT_MARKET_DATA_CACHE_SECONDS;
  }

  return Math.min(300, Math.max(5, Math.trunc(numeric)));
}

function buildPortableConfig(existingConfig, seedEnv) {
  const nextConfig = {
    appPassword:
      existingConfig?.appPassword?.trim() ||
      seedEnv.APP_PASSWORD ||
      DEFAULT_APP_PASSWORD,
    sessionSecret:
      existingConfig?.sessionSecret?.trim() ||
      seedEnv.SESSION_SECRET ||
      crypto.randomBytes(32).toString("hex"),
    marketDataCacheSeconds: normalizeCacheSeconds(
      existingConfig?.marketDataCacheSeconds ?? seedEnv.MARKET_DATA_CACHE_SECONDS,
    ),
  };

  const twelveDataApiKey =
    existingConfig?.twelveDataApiKey?.trim() || seedEnv.TWELVE_DATA_API_KEY || "";

  if (twelveDataApiKey) {
    nextConfig.twelveDataApiKey = twelveDataApiKey;
  }

  return nextConfig;
}

function ensurePortableConfig(paths) {
  ensureDirectory(paths.dataDir);
  ensureDirectory(paths.logsDir);
  ensureFile(paths.dbPath);

  const seedEnv = readDotEnvFile(paths.dotEnvPath);
  const existingConfig = readJsonFile(paths.configPath);
  const nextConfig = buildPortableConfig(existingConfig, seedEnv);

  fs.writeFileSync(paths.configPath, `${JSON.stringify(nextConfig, null, 2)}\n`, "utf8");

  return nextConfig;
}

function writePortableLog(paths, scope, error) {
  ensureDirectory(paths.logsDir);

  const logPath = path.join(paths.logsDir, "desktop-runtime.log");
  const timestamp = new Date().toISOString();
  const message = error instanceof Error ? error.stack || error.message : String(error);

  appendLogFile(logPath, `[${timestamp}] ${scope}\n${message}\n\n`);

  return logPath;
}

function toPrismaSqliteUrl(filePath) {
  const normalized = path.resolve(filePath).replace(/\\/g, "/");
  return `file:${normalized}`;
}

function buildPortableEnv(paths, config, baseEnv = process.env) {
  const nextEnv = {
    ...baseEnv,
    DATABASE_URL: toPrismaSqliteUrl(paths.dbPath),
    APP_PASSWORD: config.appPassword,
    SESSION_SECRET: config.sessionSecret,
    MARKET_DATA_CACHE_SECONDS: String(config.marketDataCacheSeconds),
    PORTABLE_APP_ROOT: paths.appRoot,
    PORTABLE_APP_DATA_DIR: paths.dataDir,
    PORTABLE_APP_CONFIG_PATH: paths.configPath,
  };

  if (config.twelveDataApiKey) {
    nextEnv.TWELVE_DATA_API_KEY = config.twelveDataApiKey;
  } else {
    delete nextEnv.TWELVE_DATA_API_KEY;
  }

  return nextEnv;
}

module.exports = {
  DEFAULT_APP_PASSWORD,
  buildPortableEnv,
  ensurePortableConfig,
  getPortablePaths,
  toPrismaSqliteUrl,
  writePortableLog,
};
