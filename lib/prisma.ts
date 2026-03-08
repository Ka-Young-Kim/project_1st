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

function createPrismaClient() {
  return new PrismaClient({
    log: ["error", "warn"],
  });
}

function hasAppSettingsModel(client: PrismaClient | undefined) {
  return Boolean(client && "appSettings" in client);
}

const prismaClient = hasAppSettingsModel(globalThis.prismaGlobal)
  ? globalThis.prismaGlobal!
  : createPrismaClient();

export const prisma: PrismaClient = prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
