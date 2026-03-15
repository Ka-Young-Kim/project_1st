import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const nodeBinary = process.execPath;

function getPackageRoot(packageName) {
  return path.dirname(require.resolve(`${packageName}/package.json`));
}

function getPackageEntry(packageName, relativePath) {
  return path.join(getPackageRoot(packageName), relativePath);
}

function run(command, args, extraEnv = {}) {
  execFileSync(command, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      ...extraEnv,
    },
  });
}

function runNodeScript(scriptPath, args = [], extraEnv = {}) {
  run(nodeBinary, [scriptPath, ...args], extraEnv);
}

function downloadWindowsPrismaEngines() {
  const postinstallScriptPath = path.join(
    process.cwd(),
    "node_modules",
    "@prisma",
    "engines",
    "dist",
    "scripts",
    "postinstall.js",
  );

  runNodeScript(postinstallScriptPath, [], {
    PRISMA_CLI_BINARY_TARGETS: "windows",
  });
}

rmSync(path.join(process.cwd(), "dist-electron"), { recursive: true, force: true });

runNodeScript(getPackageEntry("prisma", "build/index.js"), ["generate"]);
downloadWindowsPrismaEngines();
runNodeScript(getPackageEntry("next", "dist/bin/next"), ["build"], {
  NEXT_BUILD_TARGET: "desktop",
});

const standaloneServerPath = path.join(process.cwd(), ".next", "standalone", "server.js");

if (!existsSync(standaloneServerPath)) {
  throw new Error("Next standalone server output was not generated.");
}

runNodeScript(getPackageEntry("electron-builder", "cli.js"), ["--win", "dir"], {
  CSC_IDENTITY_AUTO_DISCOVERY: "false",
});
