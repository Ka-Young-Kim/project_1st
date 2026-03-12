CREATE TABLE "PortfolioItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "linkedInvestmentItemId" TEXT,
    "portfolioAccountId" TEXT,
    "portfolioAssetGroupId" TEXT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL DEFAULT 0,
    "averagePrice" DECIMAL NOT NULL DEFAULT 0,
    "currentPrice" DECIMAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PortfolioItem_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PortfolioItem_linkedInvestmentItemId_fkey" FOREIGN KEY ("linkedInvestmentItemId") REFERENCES "InvestmentItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PortfolioItem_portfolioAccountId_fkey" FOREIGN KEY ("portfolioAccountId") REFERENCES "PortfolioAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PortfolioItem_portfolioAssetGroupId_fkey" FOREIGN KEY ("portfolioAssetGroupId") REFERENCES "PortfolioAssetGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "PortfolioItem_portfolioId_sortOrder_idx" ON "PortfolioItem"("portfolioId", "sortOrder");
CREATE INDEX "PortfolioItem_linkedInvestmentItemId_idx" ON "PortfolioItem"("linkedInvestmentItemId");
CREATE INDEX "PortfolioItem_portfolioAccountId_idx" ON "PortfolioItem"("portfolioAccountId");
CREATE INDEX "PortfolioItem_portfolioAssetGroupId_idx" ON "PortfolioItem"("portfolioAssetGroupId");
