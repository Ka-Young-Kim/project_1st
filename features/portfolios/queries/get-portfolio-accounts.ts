import { prisma } from "@/lib/prisma";
import { ensurePortfolioAccounts } from "@/features/portfolios/services/portfolio-management-service";

export async function getPortfolioAccounts(portfolioId?: string) {
  if (!portfolioId) {
    return [];
  }

  await ensurePortfolioAccounts(portfolioId);

  const accounts = await prisma.portfolioAccount.findMany({
    where: { portfolioId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return accounts.map((account) => ({
    id: account.id,
    name: account.name,
    bank: account.bank ?? "",
    displayId: account.displayId ?? "",
    cashTrackingEnabled: account.cashTrackingEnabled,
    cashBalance: account.cashBalance.toString(),
  }));
}
