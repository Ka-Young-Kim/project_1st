import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";

function run(command, args, extraEnv = {}) {
  execFileSync(command, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      ...extraEnv,
    },
  });
}

rmSync(path.join(process.cwd(), "dist-electron"), { recursive: true, force: true });

run("npx", ["prisma", "generate"]);
run("npx", ["next", "build"], {
  NEXT_BUILD_TARGET: "desktop",
});

const standaloneServerPath = path.join(process.cwd(), ".next", "standalone", "server.js");

if (!existsSync(standaloneServerPath)) {
  throw new Error("Next standalone server output was not generated.");
}

run("npx", ["electron-builder", "--win", "dir"], {
  CSC_IDENTITY_AUTO_DISCOVERY: "false",
});
