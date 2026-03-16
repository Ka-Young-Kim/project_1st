import { prisma } from "@/lib/prisma";

export async function getPortfolioAccounts(portfolioId?: string) {
  if (!portfolioId) {
    return [];
  }

  const accounts = await prisma.portfolioAccount.findMany({
    where: { portfolioId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return accounts.map((account) => ({
    id: account.id,
    name: account.name,
    bank: account.bank ?? "",
    displayId: account.displayId ?? "",
    cashTrackingEnabled: true,
    cashBalance: account.cashBalance.toString(),
  }));
}
