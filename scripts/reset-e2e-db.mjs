import { execFileSync } from "node:child_process";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const databasePath = path.join(process.cwd(), "prisma", "e2e.db");
const journalPath = `${databasePath}-journal`;

if (existsSync(databasePath)) {
  rmSync(databasePath);
}

if (existsSync(journalPath)) {
  rmSync(journalPath);
}

writeFileSync(databasePath, "");

execFileSync("npx", ["prisma", "db", "push", "--skip-generate"], {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: `file:${databasePath}`,
  },
});

execFileSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  env: {
    ...process.env,
  },
});
