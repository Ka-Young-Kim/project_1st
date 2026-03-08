import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function readDotEnvValue(key) {
  if (!existsSync(".env")) {
    return undefined;
  }

  const lines = readFileSync(".env", "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const [name, ...rest] = trimmed.split("=");
    if (name === key) {
      return rest.join("=").replace(/^"(.*)"$/, "$1");
    }
  }

  return undefined;
}

function toAbsoluteSqliteUrl(url) {
  if (!url || !url.startsWith("file:./")) {
    return url;
  }

  const relativePath = url.slice("file:".length);
  return `file:${path.join(process.cwd(), relativePath)}`;
}

const databaseUrl = toAbsoluteSqliteUrl(
  process.env.DATABASE_URL ?? readDotEnvValue("DATABASE_URL"),
);

execFileSync(
  "npx",
  ["prisma", "db", "push"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      ...(databaseUrl ? { DATABASE_URL: databaseUrl } : {}),
    },
  },
);
