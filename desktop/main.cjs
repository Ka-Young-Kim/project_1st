/* eslint-disable @typescript-eslint/no-require-imports */
"use strict";

const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");
const { createRequire } = require("node:module");
const { app, BrowserWindow, ipcMain, shell } = require("electron");

const {
  buildPortableEnv,
  ensurePortableConfig,
  getPortablePaths,
  writePortableLog,
} = require("./runtime.cjs");
const {
  WINDOW_CHANNELS,
  getMainWindowOptions,
  getWindowStatePayload,
} = require("./window-shell.cjs");

const requireFromHere = createRequire(__filename);
const DESKTOP_TITLE = "Finance Dashboard";
const isDesktopDev = process.env.DESKTOP_DEV === "1";

let mainWindow = null;
let serverProcess = null;
let activeServerUrl = null;
let activePaths = null;

function getPackageRoot(packageName) {
  if (app.isPackaged) {
    const unpackedRoot = path.join(
      process.resourcesPath,
      "app.asar.unpacked",
      "node_modules",
      packageName,
    );

    if (fs.existsSync(unpackedRoot)) {
      return unpackedRoot;
    }
  }

  return path.dirname(requireFromHere.resolve(`${packageName}/package.json`));
}

function getPackageEntry(packageName, relativePath) {
  return path.join(getPackageRoot(packageName), relativePath);
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function findOpenPort() {
  return new Promise((resolve, reject) => {
    const server = http.createServer();

    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() => resolve(port));
    });
  });
}

function waitForServer(url, timeoutMs = 45_000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const request = http.get(`${url}/api/health`, (response) => {
        response.resume();

        if (response.statusCode && response.statusCode < 500) {
          resolve();
          return;
        }

        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error("Timed out while waiting for the desktop server."));
          return;
        }

        delay(500).then(attempt).catch(reject);
      });

      request.on("error", async () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error("Timed out while waiting for the desktop server."));
          return;
        }

        await delay(500);
        attempt();
      });
    };

    attempt();
  });
}

function sanitizeForHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderRecoveryHtml(error) {
  const title = "데스크톱 실행 복구 필요";
  const description = error instanceof Error ? error.message : String(error);

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #0a1222;
        color: #eef4ff;
        font-family: "Noto Sans KR", "Segoe UI", sans-serif;
      }
      .panel {
        width: min(720px, calc(100vw - 48px));
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(20, 29, 53, 0.98), rgba(17, 26, 48, 0.98));
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
        padding: 28px;
      }
      .eyebrow {
        margin: 0;
        color: #8ea4cf;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      h1 {
        margin: 14px 0 0;
        font-size: 30px;
        line-height: 1.2;
      }
      p {
        margin: 14px 0 0;
        color: #bfd2f8;
        line-height: 1.6;
      }
      code {
        display: block;
        margin-top: 16px;
        border-radius: 16px;
        background: rgba(8, 15, 29, 0.6);
        padding: 14px 16px;
        color: #f8b4b4;
        white-space: pre-wrap;
        word-break: break-word;
      }
    </style>
  </head>
  <body>
    <main class="panel">
      <p class="eyebrow">Desktop Runtime</p>
      <h1>${title}</h1>
      <p>앱 초기화 중 오류가 발생했습니다. 데이터 폴더와 설정 파일 상태를 확인한 뒤 다시 실행하세요.</p>
      <code>${sanitizeForHtml(description)}</code>
    </main>
  </body>
</html>`;
}

function createRecoveryWindow(error) {
  const window = new BrowserWindow({
    width: 860,
    height: 640,
    minWidth: 720,
    minHeight: 560,
    autoHideMenuBar: true,
    backgroundColor: "#0a1222",
    title: DESKTOP_TITLE,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  window.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderRecoveryHtml(error))}`);
}

function recordRuntimeError(scope, error) {
  if (!activePaths) {
    return null;
  }

  return writePortableLog(activePaths, scope, error);
}

function registerDesktopWindowIpc(window) {
  const emitState = () => {
    if (!window.isDestroyed()) {
      window.webContents.send(
        WINDOW_CHANNELS.stateChange,
        getWindowStatePayload(window),
      );
    }
  };

  window.on("maximize", emitState);
  window.on("unmaximize", emitState);
  window.on("enter-full-screen", emitState);
  window.on("leave-full-screen", emitState);

  ipcMain.removeHandler(WINDOW_CHANNELS.stateChange);
  ipcMain.handle(WINDOW_CHANNELS.stateChange, () => getWindowStatePayload(window));

  ipcMain.removeAllListeners(WINDOW_CHANNELS.minimize);
  ipcMain.on(WINDOW_CHANNELS.minimize, () => {
    if (!window.isDestroyed()) {
      window.minimize();
    }
  });

  ipcMain.removeAllListeners(WINDOW_CHANNELS.toggleMaximize);
  ipcMain.on(WINDOW_CHANNELS.toggleMaximize, () => {
    if (window.isDestroyed()) {
      return;
    }

    if (window.isMaximized()) {
      window.unmaximize();
      return;
    }

    window.maximize();
  });

  ipcMain.removeAllListeners(WINDOW_CHANNELS.close);
  ipcMain.on(WINDOW_CHANNELS.close, () => {
    if (!window.isDestroyed()) {
      window.close();
    }
  });
}

function attachServerLogging(child) {
  if (!child.stdout || !child.stderr) {
    return;
  }

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[desktop-server] ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[desktop-server] ${chunk}`);
  });
}

function spawnNodeProcess(args, options) {
  return spawn(process.execPath, args, {
    ...options,
    env: {
      ...options.env,
      ELECTRON_RUN_AS_NODE: "1",
    },
  });
}

function runNodeCommand(args, options) {
  return new Promise((resolve, reject) => {
    const child = spawnNodeProcess(args, {
      ...options,
      stdio: "pipe",
    });

    let stderr = "";

    if (child.stdout) {
      child.stdout.on("data", (chunk) => {
        process.stdout.write(`[desktop-init] ${chunk}`);
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
        process.stderr.write(`[desktop-init] ${chunk}`);
      });
    }

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(stderr.trim() || `Command exited with code ${code ?? 1}`));
    });
  });
}

async function runPortableMigrations(paths, runtimeEnv) {
  const prismaCliPath = getPackageEntry("prisma", "build/index.js");

  await runNodeCommand(
    [prismaCliPath, "migrate", "deploy", "--schema", paths.schemaPath],
    {
      cwd: paths.serverRoot,
      env: runtimeEnv,
    },
  );
}

function startDesktopServer(paths, runtimeEnv, port) {
  if (isDesktopDev) {
    const nextCliPath = getPackageEntry("next", "dist/bin/next");

    return spawnNodeProcess(
      [
        nextCliPath,
        "dev",
        "--hostname",
        "127.0.0.1",
        "--port",
        String(port),
      ],
      {
        cwd: paths.serverRoot,
        env: {
          ...runtimeEnv,
          NEXT_DIST_DIR: ".next-desktop",
          PORT: String(port),
        },
        stdio: "inherit",
      },
    );
  }

  const serverEntryPath = path.join(paths.serverRoot, "server.js");
  const child = spawnNodeProcess([serverEntryPath], {
    cwd: paths.serverRoot,
    env: {
      ...runtimeEnv,
      HOSTNAME: "127.0.0.1",
      PORT: String(port),
      NODE_ENV: "production",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  attachServerLogging(child);

  return child;
}

function stopDesktopServer() {
  if (!serverProcess || serverProcess.killed) {
    return;
  }

  serverProcess.kill();
  serverProcess = null;
}

function createMainWindow(url) {
  const preloadPath = path.join(__dirname, "preload.cjs");
  const window = new BrowserWindow(getMainWindowOptions(preloadPath));

  window.webContents.setWindowOpenHandler(({ url: nextUrl }) => {
    shell.openExternal(nextUrl);

    return { action: "deny" };
  });

  window.once("ready-to-show", () => {
    window.show();
  });

  registerDesktopWindowIpc(window);
  window.loadURL(url);

  if (isDesktopDev) {
    window.webContents.openDevTools({ mode: "detach" });
  }

  return window;
}

async function bootstrapDesktopApp() {
  const paths = getPortablePaths(app.isPackaged);
  activePaths = paths;
  const config = ensurePortableConfig(paths);
  const runtimeEnv = buildPortableEnv(paths, config, process.env);

  await runPortableMigrations(paths, runtimeEnv);

  const port = await findOpenPort();
  const serverUrl = `http://127.0.0.1:${port}`;

  serverProcess = startDesktopServer(paths, runtimeEnv, port);
  serverProcess.on("exit", (code) => {
    if (app.isQuitting) {
      return;
    }

    const error = new Error(`내장 서버가 종료되었습니다. (exit code: ${code ?? 1})`);
    recordRuntimeError("server-exit", error);

    if (!mainWindow || mainWindow.isDestroyed()) {
      createRecoveryWindow(error);
      return;
    }

    mainWindow.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(renderRecoveryHtml(error))}`,
    );
  });

  await waitForServer(serverUrl);

  activeServerUrl = serverUrl;
  mainWindow = createMainWindow(serverUrl);
}

app.on("before-quit", () => {
  app.isQuitting = true;
  stopDesktopServer();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (!BrowserWindow.getAllWindows().length && activeServerUrl) {
    mainWindow = createMainWindow(activeServerUrl);
  }
});

app.whenReady().then(async () => {
  try {
    await bootstrapDesktopApp();
  } catch (error) {
    recordRuntimeError("bootstrap-failure", error);
    createRecoveryWindow(error);
  }
});
