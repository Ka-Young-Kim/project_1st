CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "InvestmentItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "category" TEXT,
    "industry" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InvestmentItem_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

ALTER TABLE "InvestmentLog" ADD COLUMN "portfolioId" TEXT;
ALTER TABLE "InvestmentLog" ADD COLUMN "investmentItemId" TEXT;
ALTER TABLE "InvestmentItem" ADD COLUMN "quoteSymbol" TEXT;
ALTER TABLE "InvestmentItem" ADD COLUMN "exchange" TEXT;
ALTER TABLE "InvestmentItem" ADD COLUMN "currency" TEXT;

CREATE UNIQUE INDEX "InvestmentItem_portfolioId_code_key" ON "InvestmentItem"("portfolioId", "code");
