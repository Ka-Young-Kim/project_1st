import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const electronBinary = require("electron");

const child = spawn(electronBinary, ["desktop/main.cjs"], {
  stdio: "inherit",
  env: {
    ...process.env,
    DESKTOP_DEV: "1",
  },
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
