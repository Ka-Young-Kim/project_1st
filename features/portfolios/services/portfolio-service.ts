import { revalidatePath } from "next/cache";

import {
  PortfolioInput,
  PortfolioUpdateInput,
} from "@/features/portfolios/schemas/portfolio";
import { ensurePortfolioAccounts } from "@/features/portfolios/services/portfolio-management-service";
import { prisma } from "@/lib/prisma";

function revalidatePortfolioViews() {
  revalidatePath("/");
  revalidatePath("/items");
  revalidatePath("/journal");
  revalidatePath("/portfolios");
  revalidatePath("/portfolio-hub");
}

export async function createPortfolio(input: PortfolioInput) {
  const portfolio = await prisma.portfolio.create({
    data: {
      name: input.name,
      description: input.description || null,
    },
  });

  await ensurePortfolioAccounts(portfolio.id);

  revalidatePortfolioViews();
  return portfolio;
}

export async function updatePortfolio(input: PortfolioUpdateInput) {
  await prisma.portfolio.update({
    where: { id: input.id },
    data: {
      name: input.name,
      description: input.description || null,
    },
  });

  revalidatePortfolioViews();
}

export async function deletePortfolio(id: string) {
  const [itemCount, logCount, totalPortfolios] = await Promise.all([
    prisma.investmentItem.count({ where: { portfolioId: id } }),
    prisma.investmentLog.count({ where: { portfolioId: id } }),
    prisma.portfolio.count(),
  ]);

  if (totalPortfolios <= 1 || itemCount > 0 || logCount > 0) {
    return { ok: false as const };
  }

  await prisma.portfolio.delete({ where: { id } });
  revalidatePortfolioViews();
  return { ok: true as const };
}
