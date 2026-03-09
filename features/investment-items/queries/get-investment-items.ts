import {
  getInvestmentItemCategoryLabel,
  getInvestmentItemCategoryRank,
  normalizeInvestmentItemCategory,
} from "@/features/investment-items/lib/category";
import { prisma } from "@/lib/prisma";

export async function getInvestmentItems({
  activeOnly = false,
  portfolioId,
}: { activeOnly?: boolean; portfolioId?: string } = {}) {
  const where = {
    ...(activeOnly ? { active: true } : {}),
    ...(portfolioId ? { portfolioId } : {}),
  };

  const [items, logs] = await Promise.all([
    prisma.investmentItem.findMany({
      where,
      include: {
        _count: {
          select: {
            logs: true,
          },
        },
      },
      orderBy: [{ active: "desc" }, { name: "asc" }],
    }),
    prisma.investmentLog.findMany({
      where: {
        ...(portfolioId ? { portfolioId } : {}),
        investmentItemId: {
          not: null,
        },
      },
      select: {
        investmentItemId: true,
        action: true,
        quantity: true,
      },
    }),
  ]);

  const quantityByItemId = logs.reduce<Map<string, number>>((acc, log) => {
    if (!log.investmentItemId) {
      return acc;
    }

    const quantity = Number(log.quantity);
    const signedQuantity = log.action === "buy" ? quantity : -quantity;
    acc.set(log.investmentItemId, (acc.get(log.investmentItemId) ?? 0) + signedQuantity);

    return acc;
  }, new Map());

  return items
    .map((item) => ({
      id: item.id,
      portfolioId: item.portfolioId,
      name: item.name,
      code: item.code,
      quoteSymbol: item.quoteSymbol,
      exchange: item.exchange,
      currency: item.currency,
      category: normalizeInvestmentItemCategory(item.category),
      categoryLabel: getInvestmentItemCategoryLabel(item.category),
      industry: item.industry,
      active: item.active,
      logCount: item._count.logs,
      isHolding: (quantityByItemId.get(item.id) ?? 0) > 0,
      updatedAt: item.updatedAt,
    }))
    .sort((left, right) => {
      const categoryDiff =
        getInvestmentItemCategoryRank(left.category) -
        getInvestmentItemCategoryRank(right.category);

      if (categoryDiff !== 0) {
        return categoryDiff;
      }

      return left.name.localeCompare(right.name, "ko");
    });
}
