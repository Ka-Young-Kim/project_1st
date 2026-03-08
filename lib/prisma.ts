import path from "node:path";

import { PrismaClient } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

if (process.env.DATABASE_URL?.startsWith("file:./")) {
  process.env.DATABASE_URL = `file:${path.join(
    process.cwd(),
    process.env.DATABASE_URL.slice("file:".length),
  )}`;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
