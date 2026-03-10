import path from "node:path";

import { PrismaClient } from "@prisma/client";

import { logger } from "@/lib/logger";

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

function hasRequiredModels(client: PrismaClient | undefined) {
  return Boolean(
    client &&
      "appSettings" in client &&
      "portfolioAccount" in client &&
      "portfolioAssetGroup" in client &&
      "portfolioHolding" in client &&
      "portfolioSnapshot" in client,
  );
}

function getOrCreatePrismaClient(client: PrismaClient | undefined): PrismaClient {
  if (client && hasRequiredModels(client)) {
    return client;
  }

  if (client) {
    logger.warn("prisma.client.stale_model_cache", {
      hasAppSettings: "appSettings" in client,
      hasPortfolioAccount: "portfolioAccount" in client,
      hasPortfolioAssetGroup: "portfolioAssetGroup" in client,
      hasPortfolioHolding: "portfolioHolding" in client,
      hasPortfolioSnapshot: "portfolioSnapshot" in client,
    });
    void client.$disconnect().catch(() => undefined);
  }

  return createPrismaClient();
}

const prismaClient = getOrCreatePrismaClient(globalThis.prismaGlobal);

export const prisma: PrismaClient = prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
