import { revalidatePath } from "next/cache";

import {
  PortfolioInput,
  PortfolioUpdateInput,
} from "@/features/portfolios/schemas/portfolio";
import { prisma } from "@/lib/prisma";

function revalidatePortfolioViews() {
  revalidatePath("/");
  revalidatePath("/items");
  revalidatePath("/journal");
  revalidatePath("/portfolios");
}

export async function createPortfolio(input: PortfolioInput) {
  const portfolio = await prisma.portfolio.create({
    data: {
      name: input.name,
      description: input.description || null,
      active: input.active,
    },
  });

  if (input.active) {
    await prisma.portfolio.updateMany({
      where: { id: { not: portfolio.id } },
      data: { active: false },
    });
  }

  revalidatePortfolioViews();
}

export async function updatePortfolio(input: PortfolioUpdateInput) {
  if (input.active) {
    await prisma.portfolio.updateMany({
      where: { id: { not: input.id } },
      data: { active: false },
    });
  }

  await prisma.portfolio.update({
    where: { id: input.id },
    data: {
      name: input.name,
      description: input.description || null,
      active: input.active,
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
