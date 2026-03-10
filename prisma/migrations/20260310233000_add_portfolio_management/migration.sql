ALTER TABLE "InvestmentLog" ADD COLUMN "portfolioAccountId" TEXT;

CREATE TABLE "PortfolioAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "cashTrackingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "cashBalance" DECIMAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PortfolioAccount_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PortfolioAssetGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetWeight" DECIMAL NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PortfolioAssetGroup_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PortfolioHolding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "investmentItemId" TEXT NOT NULL,
    "portfolioAssetGroupId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PortfolioHolding_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PortfolioHolding_investmentItemId_fkey" FOREIGN KEY ("investmentItemId") REFERENCES "InvestmentItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PortfolioHolding_portfolioAssetGroupId_fkey" FOREIGN KEY ("portfolioAssetGroupId") REFERENCES "PortfolioAssetGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "PortfolioSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "snapshotDate" DATETIME NOT NULL,
    "investedAmount" DECIMAL NOT NULL,
    "marketValue" DECIMAL NOT NULL,
    "profitAmount" DECIMAL NOT NULL,
    "profitRate" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PortfolioSnapshot_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PortfolioAssetGroupSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioSnapshotId" TEXT NOT NULL,
    "portfolioAssetGroupId" TEXT,
    "name" TEXT NOT NULL,
    "targetWeight" DECIMAL NOT NULL,
    "currentWeight" DECIMAL NOT NULL,
    "investedAmount" DECIMAL NOT NULL,
    "marketValue" DECIMAL NOT NULL,
    "profitAmount" DECIMAL NOT NULL,
    "profitRate" DECIMAL NOT NULL,
    "buyAmount" DECIMAL NOT NULL,
    "sellAmount" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PortfolioAssetGroupSnapshot_portfolioSnapshotId_fkey" FOREIGN KEY ("portfolioSnapshotId") REFERENCES "PortfolioSnapshot" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PortfolioAssetGroupSnapshot_portfolioAssetGroupId_fkey" FOREIGN KEY ("portfolioAssetGroupId") REFERENCES "PortfolioAssetGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "PortfolioHoldingSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioSnapshotId" TEXT NOT NULL,
    "portfolioHoldingId" TEXT,
    "portfolioAssetGroupId" TEXT,
    "investmentItemId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "averagePrice" DECIMAL NOT NULL,
    "currentPrice" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL,
    "investedAmount" DECIMAL NOT NULL,
    "marketValue" DECIMAL NOT NULL,
    "profitAmount" DECIMAL NOT NULL,
    "profitRate" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PortfolioHoldingSnapshot_portfolioSnapshotId_fkey" FOREIGN KEY ("portfolioSnapshotId") REFERENCES "PortfolioSnapshot" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PortfolioHoldingSnapshot_portfolioHoldingId_fkey" FOREIGN KEY ("portfolioHoldingId") REFERENCES "PortfolioHolding" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PortfolioHoldingSnapshot_portfolioAssetGroupId_fkey" FOREIGN KEY ("portfolioAssetGroupId") REFERENCES "PortfolioAssetGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "PortfolioAccountSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioSnapshotId" TEXT NOT NULL,
    "portfolioAccountId" TEXT,
    "name" TEXT NOT NULL,
    "displayId" TEXT,
    "investedAmount" DECIMAL NOT NULL,
    "marketValue" DECIMAL NOT NULL,
    "cashValue" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PortfolioAccountSnapshot_portfolioSnapshotId_fkey" FOREIGN KEY ("portfolioSnapshotId") REFERENCES "PortfolioSnapshot" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PortfolioAccountSnapshot_portfolioAccountId_fkey" FOREIGN KEY ("portfolioAccountId") REFERENCES "PortfolioAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "PortfolioAccount_portfolioId_name_key" ON "PortfolioAccount"("portfolioId", "name");
CREATE UNIQUE INDEX "PortfolioAssetGroup_portfolioId_name_key" ON "PortfolioAssetGroup"("portfolioId", "name");
CREATE UNIQUE INDEX "PortfolioHolding_portfolioId_investmentItemId_key" ON "PortfolioHolding"("portfolioId", "investmentItemId");
CREATE UNIQUE INDEX "PortfolioSnapshot_portfolioId_snapshotDate_key" ON "PortfolioSnapshot"("portfolioId", "snapshotDate");
CREATE INDEX "InvestmentLog_portfolioAccountId_idx" ON "InvestmentLog"("portfolioAccountId");
