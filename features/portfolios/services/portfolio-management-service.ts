import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import {
  PortfolioAccountInput,
  PortfolioAccountUpdateInput,
  PortfolioAssetGroupInput,
  PortfolioAssetGroupUpdateInput,
  PortfolioHoldingAssignmentInput,
  PortfolioItemInput,
  PortfolioItemUpdateInput,
} from "@/features/portfolios/schemas/portfolio-management";
import { getLatestQuotes, getUsdToKrwRate } from "@/lib/market-data/quote-service";
import { prisma } from "@/lib/prisma";
import { getTodayRangeInSeoul } from "@/lib/utils";

type PortfolioAggregate = Awaited<ReturnType<typeof getPortfolioManagementData>>;
export type PortfolioManagementData = PortfolioAggregate;

type AccountBucket = {
  accountId: string | null;
  investmentItemId: string;
  quantity: number;
  costBasis: number;
  lastTradePrice: number;
};

function toDecimal(value: number | string) {
  return new Prisma.Decimal(value);
}

function round2(value: number) {
  return Number(value.toFixed(2));
}

function percentOf(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return (value / total) * 100;
}

function toKrw(value: number, currency: string, usdToKrwRate: number | null) {
  if (currency === "USD" && usdToKrwRate) {
    return value * usdToKrwRate;
  }

  return value;
}

function revalidatePortfolioViews() {
  revalidatePath("/");
  revalidatePath("/items");
  revalidatePath("/journal");
  revalidatePath("/portfolios");
  revalidatePath("/portfolios/snapshots");
  revalidatePath("/portfolio-hub");
}

function buildAccountBuckets(
  logs: Array<{
    portfolioAccountId: string | null;
    investmentItemId: string | null;
    action: string;
    quantity: Prisma.Decimal;
    price: Prisma.Decimal;
  }>,
) {
  const buckets = new Map<string, AccountBucket>();

  for (const log of logs) {
    if (!log.investmentItemId) {
      continue;
    }

    const accountId = log.portfolioAccountId ?? "__unassigned__";
    const key = `${accountId}:${log.investmentItemId}`;
    const current = buckets.get(key) ?? {
      accountId: log.portfolioAccountId,
      investmentItemId: log.investmentItemId,
      quantity: 0,
      costBasis: 0,
      lastTradePrice: Number(log.price),
    };
    const quantity = Number(log.quantity);
    const price = Number(log.price);

    if (log.action === "buy") {
      current.quantity += quantity;
      current.costBasis += quantity * price;
    } else if (current.quantity > 0) {
      const averagePrice =
        current.quantity === 0 ? 0 : current.costBasis / current.quantity;
      const sellQuantity = Math.min(quantity, current.quantity);
      current.quantity -= sellQuantity;
      current.costBasis = Math.max(
        0,
        current.costBasis - averagePrice * sellQuantity,
      );
    }

    current.lastTradePrice = price;
    buckets.set(key, current);
  }

  return buckets;
}

function buildManualCode(name: string) {
  const digits = Date.now().toString().slice(-6);
  const normalizedName = name
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9가-힣]/g, "")
    .slice(0, 8);

  return `${normalizedName || "PITEM"}${digits}`.slice(0, 20);
}

async function validatePortfolioRelations({
  portfolioId,
  portfolioAccountId,
  portfolioAssetGroupId,
  linkedInvestmentItemId,
}: {
  portfolioId: string;
  portfolioAccountId?: string;
  portfolioAssetGroupId?: string;
  linkedInvestmentItemId?: string;
}) {
  const [account, group, item] = await Promise.all([
    portfolioAccountId
      ? prisma.portfolioAccount.findFirst({
          where: { id: portfolioAccountId, portfolioId },
          select: { id: true },
        })
      : Promise.resolve(null),
    portfolioAssetGroupId
      ? prisma.portfolioAssetGroup.findFirst({
          where: { id: portfolioAssetGroupId, portfolioId },
          select: { id: true },
        })
      : Promise.resolve(null),
    linkedInvestmentItemId
      ? prisma.investmentItem.findFirst({
          where: { id: linkedInvestmentItemId, portfolioId },
          select: {
            id: true,
            name: true,
            code: true,
            quoteSymbol: true,
            exchange: true,
            currency: true,
          },
        })
      : Promise.resolve(null),
  ]);

  if (portfolioAccountId && !account) {
    throw new Error(`Portfolio account not found: ${portfolioAccountId}`);
  }

  if (portfolioAssetGroupId && !group) {
    throw new Error(`Portfolio asset group not found: ${portfolioAssetGroupId}`);
  }

  if (linkedInvestmentItemId && !item) {
    throw new Error(`Investment item not found: ${linkedInvestmentItemId}`);
  }

  return { linkedItem: item };
}

async function getStoredMetricsForLinkedItem(
  portfolioId: string,
  linkedInvestmentItemId: string,
  portfolioAccountId: string,
) {
  const logs = await prisma.investmentLog.findMany({
    where: {
      portfolioId,
      investmentItemId: linkedInvestmentItemId,
      portfolioAccountId,
    },
    orderBy: [{ tradeDate: "asc" }, { createdAt: "asc" }],
    select: {
      portfolioAccountId: true,
      investmentItemId: true,
      action: true,
      quantity: true,
      price: true,
    },
  });
  const bucket = buildAccountBuckets(logs).get(
    `${portfolioAccountId}:${linkedInvestmentItemId}`,
  );

  return {
    quantity: bucket?.quantity ?? 0,
    averagePrice:
      bucket && bucket.quantity > 0 ? bucket.costBasis / bucket.quantity : 0,
    currentPrice: bucket?.lastTradePrice ?? 0,
  };
}

export async function ensurePortfolioAccounts(portfolioId: string) {
  const existing = await prisma.portfolioAccount.findFirst({
    where: { portfolioId },
    select: { id: true },
  });

  if (existing) {
    return;
  }

  try {
    await prisma.portfolioAccount.create({
      data: {
        portfolioId,
        name: "기본 계좌",
        nickname: "",
        displayId: "",
        sortOrder: 0,
        cashTrackingEnabled: false,
        cashBalance: toDecimal(0),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return;
    }

    throw error;
  }
}

export async function ensurePortfolioItems(portfolioId: string) {
  await ensurePortfolioAccounts(portfolioId);

  const existing = await prisma.portfolioItem.findFirst({
    where: { portfolioId },
    select: { id: true },
  });

  if (existing) {
    return;
  }

  const [items, holdings, logs] = await Promise.all([
    prisma.investmentItem.findMany({
      where: { portfolioId },
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        code: true,
      },
    }),
    prisma.portfolioHolding.findMany({
      where: { portfolioId, active: true },
      select: {
        investmentItemId: true,
        portfolioAssetGroupId: true,
      },
    }),
    prisma.investmentLog.findMany({
      where: { portfolioId },
      orderBy: [{ tradeDate: "asc" }, { createdAt: "asc" }],
      select: {
        portfolioAccountId: true,
        investmentItemId: true,
        action: true,
        quantity: true,
        price: true,
      },
    }),
  ]);

  const bucketMap = buildAccountBuckets(logs);
  const holdingMap = new Map(
    holdings.map((holding) => [holding.investmentItemId, holding]),
  );

  const rows = Array.from(bucketMap.values())
    .filter((bucket) => bucket.quantity > 0)
    .map((bucket, index) => {
      const item = items.find(
        (candidate) => candidate.id === bucket.investmentItemId,
      );

      if (!item) {
        return null;
      }

      return {
        portfolioId,
        linkedInvestmentItemId: item.id,
        portfolioAccountId: bucket.accountId,
        portfolioAssetGroupId:
          holdingMap.get(bucket.investmentItemId)?.portfolioAssetGroupId ?? null,
        name: item.name,
        code: item.code,
        quantity: bucket.quantity,
        averagePrice:
          bucket.quantity > 0 ? bucket.costBasis / bucket.quantity : 0,
        currentPrice: bucket.lastTradePrice,
        sortOrder: index,
      };
    })
    .filter(Boolean) as Array<{
    portfolioId: string;
    linkedInvestmentItemId: string;
    portfolioAccountId: string | null;
    portfolioAssetGroupId: string | null;
    name: string;
    code: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    sortOrder: number;
  }>;

  if (rows.length === 0) {
    return;
  }

  await prisma.$transaction(
    rows.map((row) =>
      prisma.portfolioItem.create({
        data: {
          portfolioId: row.portfolioId,
          linkedInvestmentItemId: row.linkedInvestmentItemId,
          portfolioAccountId: row.portfolioAccountId,
          portfolioAssetGroupId: row.portfolioAssetGroupId,
          name: row.name,
          code: row.code,
          quantity: toDecimal(row.quantity),
          averagePrice: toDecimal(row.averagePrice),
          currentPrice: toDecimal(row.currentPrice),
          sortOrder: row.sortOrder,
        },
      }),
    ),
  );
}

export async function createPortfolioAccount(input: PortfolioAccountInput) {
  await prisma.portfolioAccount.create({
    data: {
      portfolioId: input.portfolioId,
      name: input.name,
      nickname: input.nickname || null,
      displayId: input.displayId || null,
      sortOrder: input.sortOrder,
      cashTrackingEnabled: input.cashTrackingEnabled,
      cashBalance: toDecimal(input.cashBalance),
    },
  });

  revalidatePortfolioViews();
}

export async function updatePortfolioAccount(input: PortfolioAccountUpdateInput) {
  await prisma.portfolioAccount.update({
    where: { id: input.id },
    data: {
      name: input.name,
      nickname: input.nickname || null,
      displayId: input.displayId || null,
      sortOrder: input.sortOrder,
      cashTrackingEnabled: input.cashTrackingEnabled,
      cashBalance: toDecimal(input.cashBalance),
    },
  });

  revalidatePortfolioViews();
}

export async function deletePortfolioAccount(id: string) {
  const account = await prisma.portfolioAccount.findUnique({
    where: { id },
    include: {
      portfolio: {
        include: {
          _count: {
            select: {
              accounts: true,
            },
          },
        },
      },
    },
  });

  if (!account) {
    return { ok: false as const };
  }

  if (account.portfolio._count.accounts <= 1) {
    return { ok: false as const };
  }

  await prisma.portfolioAccount.delete({
    where: { id },
  });

  revalidatePortfolioViews();
  return { ok: true as const };
}

export async function createPortfolioAssetGroup(input: PortfolioAssetGroupInput) {
  await prisma.portfolioAssetGroup.create({
    data: {
      portfolioId: input.portfolioId,
      name: input.name,
      targetWeight: toDecimal(input.targetWeight),
      sortOrder: input.sortOrder,
    },
  });

  revalidatePortfolioViews();
}

export async function updatePortfolioAssetGroup(input: PortfolioAssetGroupUpdateInput) {
  await prisma.portfolioAssetGroup.update({
    where: { id: input.id },
    data: {
      name: input.name,
      targetWeight: toDecimal(input.targetWeight),
      sortOrder: input.sortOrder,
    },
  });

  revalidatePortfolioViews();
}

export async function savePortfolioAssetGroupTargets(
  portfolioId: string,
  targets: Array<{ id: string; targetWeight: string }>,
) {
  const total = targets.reduce((sum, item) => sum + Number(item.targetWeight), 0);

  if (Math.abs(total - 100) > 0.0001) {
    throw new Error("Asset group target weights must sum to 100.");
  }

  await prisma.$transaction(
    targets.map((target) =>
      prisma.portfolioAssetGroup.update({
        where: { id: target.id },
        data: {
          targetWeight: toDecimal(target.targetWeight),
        },
      }),
    ),
  );

  revalidatePortfolioViews();
}

export async function deletePortfolioAssetGroup(id: string) {
  const group = await prisma.portfolioAssetGroup.findUnique({
    where: { id },
    select: {
      portfolioId: true,
    },
  });

  if (!group) {
    return;
  }

  await prisma.$transaction([
    prisma.portfolioHolding.updateMany({
      where: { portfolioAssetGroupId: id },
      data: { portfolioAssetGroupId: null },
    }),
    prisma.portfolioItem.updateMany({
      where: { portfolioAssetGroupId: id },
      data: { portfolioAssetGroupId: null },
    }),
    prisma.portfolioAssetGroup.delete({
      where: { id },
    }),
  ]);

  revalidatePortfolioViews();
}

export async function createPortfolioItem(input: PortfolioItemInput) {
  const { linkedItem } = await validatePortfolioRelations({
    portfolioId: input.portfolioId,
    portfolioAccountId: input.portfolioAccountId,
    portfolioAssetGroupId: input.portfolioAssetGroupId,
    linkedInvestmentItemId: input.linkedInvestmentItemId,
  });

  if (!linkedItem && !input.name.trim()) {
    throw new Error("Portfolio item name is required.");
  }

  const metrics =
    linkedItem && input.portfolioAccountId
      ? await getStoredMetricsForLinkedItem(
          input.portfolioId,
          linkedItem.id,
          input.portfolioAccountId,
        )
      : {
          quantity: Number(input.quantity),
          averagePrice: Number(input.averagePrice),
          currentPrice: Number(input.currentPrice) || Number(input.averagePrice),
        };

  await prisma.portfolioItem.create({
    data: {
      portfolioId: input.portfolioId,
      linkedInvestmentItemId: linkedItem?.id ?? null,
      portfolioAccountId: input.portfolioAccountId || null,
      portfolioAssetGroupId: input.portfolioAssetGroupId || null,
      name: linkedItem?.name ?? input.name.trim(),
      code:
        linkedItem?.code ??
        (input.code.trim() || buildManualCode(input.name)),
      quantity: toDecimal(metrics.quantity),
      averagePrice: toDecimal(metrics.averagePrice),
      currentPrice: toDecimal(metrics.currentPrice),
      notes: input.notes || null,
      active: input.active,
      sortOrder: input.sortOrder,
    },
  });

  revalidatePortfolioViews();
}

export async function updatePortfolioItem(input: PortfolioItemUpdateInput) {
  const existing = await prisma.portfolioItem.findUnique({
    where: { id: input.id },
    select: { id: true, portfolioId: true, name: true },
  });

  if (!existing || existing.portfolioId !== input.portfolioId) {
    throw new Error(`Portfolio item not found: ${input.id}`);
  }

  const { linkedItem } = await validatePortfolioRelations({
    portfolioId: input.portfolioId,
    portfolioAccountId: input.portfolioAccountId,
    portfolioAssetGroupId: input.portfolioAssetGroupId,
    linkedInvestmentItemId: input.linkedInvestmentItemId,
  });

  if (!linkedItem && !input.name.trim()) {
    throw new Error("Portfolio item name is required.");
  }

  const metrics =
    linkedItem && input.portfolioAccountId
      ? await getStoredMetricsForLinkedItem(
          input.portfolioId,
          linkedItem.id,
          input.portfolioAccountId,
        )
      : {
          quantity: Number(input.quantity),
          averagePrice: Number(input.averagePrice),
          currentPrice: Number(input.currentPrice) || Number(input.averagePrice),
        };

  await prisma.portfolioItem.update({
    where: { id: input.id },
    data: {
      linkedInvestmentItemId: linkedItem?.id ?? null,
      portfolioAccountId: input.portfolioAccountId || null,
      portfolioAssetGroupId: input.portfolioAssetGroupId || null,
      name: linkedItem?.name ?? input.name.trim(),
      code:
        linkedItem?.code ??
        (input.code.trim() || buildManualCode(input.name || existing.name)),
      quantity: toDecimal(metrics.quantity),
      averagePrice: toDecimal(metrics.averagePrice),
      currentPrice: toDecimal(metrics.currentPrice),
      notes: input.notes || null,
      active: input.active,
      sortOrder: input.sortOrder,
    },
  });

  revalidatePortfolioViews();
}

export async function deletePortfolioItem(id: string) {
  await prisma.portfolioItem.delete({
    where: { id },
  });

  revalidatePortfolioViews();
}

export async function assignPortfolioHolding(input: PortfolioHoldingAssignmentInput) {
  const item = await prisma.investmentItem.findFirst({
    where: {
      id: input.investmentItemId,
      portfolioId: input.portfolioId,
    },
    select: {
      id: true,
    },
  });

  if (!item) {
    throw new Error("Investment item does not belong to the portfolio.");
  }

  if (input.portfolioAssetGroupId) {
    const group = await prisma.portfolioAssetGroup.findFirst({
      where: {
        id: input.portfolioAssetGroupId,
        portfolioId: input.portfolioId,
      },
      select: { id: true },
    });

    if (!group) {
      throw new Error("Asset group does not belong to the portfolio.");
    }
  }

  await prisma.portfolioHolding.upsert({
    where: {
      portfolioId_investmentItemId: {
        portfolioId: input.portfolioId,
        investmentItemId: input.investmentItemId,
      },
    },
    update: {
      portfolioAssetGroupId: input.portfolioAssetGroupId || null,
      active: true,
    },
    create: {
      portfolioId: input.portfolioId,
      investmentItemId: input.investmentItemId,
      portfolioAssetGroupId: input.portfolioAssetGroupId || null,
      active: true,
    },
  });

  revalidatePortfolioViews();
}

export async function unassignPortfolioHolding(portfolioId: string, investmentItemId: string) {
  await prisma.portfolioHolding.deleteMany({
    where: {
      portfolioId,
      investmentItemId,
    },
  });

  revalidatePortfolioViews();
}

export async function getPortfolioManagementData(portfolioId: string) {
  await ensurePortfolioItems(portfolioId);

  const [portfolio, logs, snapshots, availableInvestmentItems] = await Promise.all([
    prisma.portfolio.findUniqueOrThrow({
      where: { id: portfolioId },
      include: {
        accounts: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
        assetGroups: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
        portfolioItems: {
          where: { active: true },
          include: {
            linkedInvestmentItem: true,
            portfolioAccount: true,
            portfolioAssetGroup: true,
          },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    }),
    prisma.investmentLog.findMany({
      where: { portfolioId },
      include: {
        investmentItem: true,
        portfolioAccount: true,
      },
      orderBy: [{ tradeDate: "asc" }, { createdAt: "asc" }],
    }),
    prisma.portfolioSnapshot.findMany({
      where: { portfolioId },
      orderBy: [{ snapshotDate: "desc" }, { createdAt: "desc" }],
      take: 20,
      include: {
        assetGroups: {
          orderBy: [{ createdAt: "asc" }],
        },
        accounts: {
          orderBy: [{ createdAt: "asc" }],
        },
      },
    }),
    prisma.investmentItem.findMany({
      where: { portfolioId, active: true },
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        code: true,
      },
    }),
  ]);

  const accountBuckets = buildAccountBuckets(
    logs.map((log) => ({
      portfolioAccountId: log.portfolioAccountId,
      investmentItemId: log.investmentItemId,
      action: log.action,
      quantity: log.quantity,
      price: log.price,
    })),
  );

  const linkedItems = portfolio.portfolioItems
    .map((item) => item.linkedInvestmentItem)
    .filter(Boolean);
  const quoteByCode = await getLatestQuotes(
    Array.from(
      new Map(
        linkedItems.map((item) => [
          item!.id,
          {
            code: item!.code,
            quoteSymbol: item!.quoteSymbol ?? item!.code,
            exchange: item!.exchange ?? null,
            currency: item!.currency ?? "KRW",
          },
        ]),
      ).values(),
    ),
  );
  const needsUsdToKrw = linkedItems.some((item) => {
    const liveQuote = quoteByCode.get(item!.code);
    return (liveQuote?.currency ?? item!.currency ?? "KRW") === "USD";
  });
  const usdToKrwRate = needsUsdToKrw ? await getUsdToKrwRate().catch(() => null) : null;

  const itemSummaries = portfolio.portfolioItems.map((item) => {
    const linkedItem = item.linkedInvestmentItem;
    const bucketKey = `${item.portfolioAccountId ?? "__unassigned__"}:${item.linkedInvestmentItemId ?? ""}`;
    const bucket =
      linkedItem && item.linkedInvestmentItemId
        ? accountBuckets.get(bucketKey)
        : null;
    const storedQuantity = Number(item.quantity);
    const storedAveragePrice = Number(item.averagePrice);
    const storedCurrentPrice = Number(item.currentPrice);
    const quantity = bucket?.quantity ?? storedQuantity;
    const averagePrice =
      bucket && bucket.quantity > 0
        ? bucket.costBasis / bucket.quantity
        : storedAveragePrice;
    const liveQuote = linkedItem ? quoteByCode.get(linkedItem.code) : null;
    const currency = liveQuote?.currency ?? linkedItem?.currency ?? "KRW";
    const currentPrice =
      liveQuote?.price ?? bucket?.lastTradePrice ?? storedCurrentPrice;
    const investedAmountBase = bucket?.costBasis ?? quantity * averagePrice;
    const marketValueBase = quantity * currentPrice;
    const investedAmount = round2(
      toKrw(investedAmountBase, currency, usdToKrwRate),
    );
    const marketValue = round2(toKrw(marketValueBase, currency, usdToKrwRate));
    const profitAmount = round2(marketValue - investedAmount);
    const profitRate =
      investedAmount > 0 ? round2((profitAmount / investedAmount) * 100) : 0;

    return {
      id: item.id,
      sortOrder: item.sortOrder,
      linkedInvestmentItemId: item.linkedInvestmentItemId,
      name: linkedItem?.name ?? item.name,
      code: linkedItem?.code ?? item.code,
      quantity: round2(quantity),
      averagePrice: round2(averagePrice),
      currentPrice: round2(currentPrice),
      investedAmount,
      marketValue,
      profitAmount,
      profitRate,
      currency,
      notes: item.notes ?? "",
      accountId: item.portfolioAccountId,
      accountName:
        item.portfolioAccount?.nickname?.trim() ||
        item.portfolioAccount?.name ||
        "미지정 계좌",
      accountDisplayId: item.portfolioAccount?.displayId ?? "",
      groupId: item.portfolioAssetGroupId,
      groupName: item.portfolioAssetGroup?.name ?? "미분류",
      isLinkedToInvestmentItem: Boolean(item.linkedInvestmentItemId),
    };
  });

  const totalTrackedCash = portfolio.accounts.reduce((sum, account) => {
    if (!account.cashTrackingEnabled) {
      return sum;
    }

    return sum + Number(account.cashBalance);
  }, 0);

  const portfolioInvestedAmount =
    itemSummaries.reduce((sum, item) => sum + item.investedAmount, 0) +
    totalTrackedCash;
  const portfolioMarketValue =
    itemSummaries.reduce((sum, item) => sum + item.marketValue, 0) +
    totalTrackedCash;
  const portfolioProfitAmount = portfolioMarketValue - portfolioInvestedAmount;
  const portfolioProfitRate =
    portfolioInvestedAmount > 0
      ? (portfolioProfitAmount / portfolioInvestedAmount) * 100
      : 0;

  const hasExplicitCashGroup = portfolio.assetGroups.some((group) => group.name === "현금");
  const explicitGroups = portfolio.assetGroups.map((group) => {
    const entries = itemSummaries.filter((item) => item.groupId === group.id);
    const isCashGroup = group.name === "현금";
    const investedAmount = isCashGroup
      ? totalTrackedCash
      : entries.reduce((sum, item) => sum + item.investedAmount, 0);
    const marketValue = isCashGroup
      ? totalTrackedCash
      : entries.reduce((sum, item) => sum + item.marketValue, 0);
    const profitAmount = isCashGroup ? 0 : marketValue - investedAmount;
    const profitRate = isCashGroup
      ? 0
      : investedAmount > 0
        ? (profitAmount / investedAmount) * 100
        : 0;
    const currentWeight = percentOf(marketValue, portfolioMarketValue);
    const targetWeight = Number(group.targetWeight);
    const targetMarketValue = (portfolioMarketValue * targetWeight) / 100;
    const delta = targetMarketValue - marketValue;

    return {
      id: group.id,
      name: group.name,
      targetWeight: round2(targetWeight),
      currentWeight: round2(currentWeight),
      investedAmount: round2(investedAmount),
      marketValue: round2(marketValue),
      profitAmount: round2(profitAmount),
      profitRate: round2(profitRate),
      buyAmount: round2(delta > 0 ? delta : 0),
      sellAmount: round2(delta < 0 ? Math.abs(delta) : 0),
      items: entries,
      isSynthetic: false,
    };
  });

  const uncategorizedItems = itemSummaries.filter((item) => !item.groupId);
  const syntheticGroups: Array<{
    id: string;
    name: string;
    targetWeight: number;
    currentWeight: number;
    investedAmount: number;
    marketValue: number;
    profitAmount: number;
    profitRate: number;
    buyAmount: number;
    sellAmount: number;
    items: typeof itemSummaries;
    isSynthetic: boolean;
  }> = [];

  if (uncategorizedItems.length > 0) {
    const investedAmount = uncategorizedItems.reduce(
      (sum, item) => sum + item.investedAmount,
      0,
    );
    const marketValue = uncategorizedItems.reduce(
      (sum, item) => sum + item.marketValue,
      0,
    );
    const profitAmount = marketValue - investedAmount;
    const profitRate = investedAmount > 0 ? (profitAmount / investedAmount) * 100 : 0;

    syntheticGroups.push({
      id: "__uncategorized__",
      name: "미분류",
      targetWeight: 0,
      currentWeight: round2(percentOf(marketValue, portfolioMarketValue)),
      investedAmount: round2(investedAmount),
      marketValue: round2(marketValue),
      profitAmount: round2(profitAmount),
      profitRate: round2(profitRate),
      buyAmount: 0,
      sellAmount: round2(marketValue),
      items: uncategorizedItems,
      isSynthetic: true,
    });
  }

  if (totalTrackedCash > 0 && !hasExplicitCashGroup) {
    syntheticGroups.push({
      id: "__cash__",
      name: "현금",
      targetWeight: 0,
      currentWeight: round2(percentOf(totalTrackedCash, portfolioMarketValue)),
      investedAmount: round2(totalTrackedCash),
      marketValue: round2(totalTrackedCash),
      profitAmount: 0,
      profitRate: 0,
      buyAmount: 0,
      sellAmount: round2(totalTrackedCash),
      items: [],
      isSynthetic: true,
    });
  }

  const realAccountSummaries = portfolio.accounts.map((account) => {
    const accountItems = itemSummaries.filter((item) => item.accountId === account.id);
    const investedAmount =
      accountItems.reduce((sum, item) => sum + item.investedAmount, 0) +
      (account.cashTrackingEnabled ? Number(account.cashBalance) : 0);
    const marketValue =
      accountItems.reduce((sum, item) => sum + item.marketValue, 0) +
      (account.cashTrackingEnabled ? Number(account.cashBalance) : 0);
    const profitAmount = marketValue - investedAmount;
    const profitRate =
      investedAmount > 0 ? round2((profitAmount / investedAmount) * 100) : 0;

    return {
      id: account.id,
      name: account.name,
      nickname: account.nickname ?? "",
      displayId: account.displayId ?? "",
      cashTrackingEnabled: account.cashTrackingEnabled,
      cashBalance: Number(account.cashBalance),
      investedAmount: round2(investedAmount),
      marketValue: round2(marketValue),
      profitAmount: round2(profitAmount),
      profitRate,
      currentWeight: round2(percentOf(marketValue, portfolioMarketValue)),
      items: accountItems,
    };
  });
  const unassignedItems = itemSummaries.filter((item) => !item.accountId);
  const accountSummaries = [
    ...realAccountSummaries,
    ...(unassignedItems.length > 0
      ? [
          {
            id: "__unassigned__",
            name: "미지정 계좌",
            nickname: "",
            displayId: "",
            cashTrackingEnabled: false,
            cashBalance: 0,
            investedAmount: round2(
              unassignedItems.reduce((sum, item) => sum + item.investedAmount, 0),
            ),
            marketValue: round2(
              unassignedItems.reduce((sum, item) => sum + item.marketValue, 0),
            ),
            profitAmount: round2(
              unassignedItems.reduce(
                (sum, item) => sum + (item.marketValue - item.investedAmount),
                0,
              ),
            ),
            profitRate: round2(
              (() => {
                const investedAmount = unassignedItems.reduce(
                  (sum, item) => sum + item.investedAmount,
                  0,
                );
                const marketValue = unassignedItems.reduce(
                  (sum, item) => sum + item.marketValue,
                  0,
                );

                return investedAmount > 0
                  ? ((marketValue - investedAmount) / investedAmount) * 100
                  : 0;
              })(),
            ),
            currentWeight: round2(
              percentOf(
                unassignedItems.reduce((sum, item) => sum + item.marketValue, 0),
                portfolioMarketValue,
              ),
            ),
            items: unassignedItems,
          },
        ]
      : []),
  ];

  return {
    portfolio: {
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.description,
    },
    summary: {
      investedAmount: round2(portfolioInvestedAmount),
      marketValue: round2(portfolioMarketValue),
      profitAmount: round2(portfolioProfitAmount),
      profitRate: round2(portfolioProfitRate),
      cashValue: round2(totalTrackedCash),
    },
    accounts: accountSummaries,
    assetGroups: [...explicitGroups, ...syntheticGroups],
    availableInvestmentItems,
    portfolioItems: itemSummaries,
    snapshots: snapshots.map((snapshot) => ({
      id: snapshot.id,
      snapshotDate: snapshot.snapshotDate,
      investedAmount: Number(snapshot.investedAmount),
      marketValue: Number(snapshot.marketValue),
      profitAmount: Number(snapshot.profitAmount),
      profitRate: Number(snapshot.profitRate),
      accountCount: snapshot.accounts.length,
      assetGroupCount: snapshot.assetGroups.length,
    })),
  };
}

export async function recordPortfolioSnapshot(portfolioId: string) {
  const aggregate = await getPortfolioManagementData(portfolioId);
  const snapshotDate = getTodayRangeInSeoul().start;

  const existing = await prisma.portfolioSnapshot.findUnique({
    where: {
      portfolioId_snapshotDate: {
        portfolioId,
        snapshotDate,
      },
    },
    select: {
      id: true,
    },
  });

  const snapshotId = existing?.id ?? (await prisma.portfolioSnapshot.create({
    data: {
      portfolioId,
      snapshotDate,
      investedAmount: toDecimal(aggregate.summary.investedAmount),
      marketValue: toDecimal(aggregate.summary.marketValue),
      profitAmount: toDecimal(aggregate.summary.profitAmount),
      profitRate: toDecimal(aggregate.summary.profitRate),
    },
    select: {
      id: true,
    },
  })).id;

  await prisma.$transaction([
    prisma.portfolioSnapshot.update({
      where: { id: snapshotId },
      data: {
        investedAmount: toDecimal(aggregate.summary.investedAmount),
        marketValue: toDecimal(aggregate.summary.marketValue),
        profitAmount: toDecimal(aggregate.summary.profitAmount),
        profitRate: toDecimal(aggregate.summary.profitRate),
      },
    }),
    prisma.portfolioAssetGroupSnapshot.deleteMany({
      where: { portfolioSnapshotId: snapshotId },
    }),
    prisma.portfolioHoldingSnapshot.deleteMany({
      where: { portfolioSnapshotId: snapshotId },
    }),
    prisma.portfolioAccountSnapshot.deleteMany({
      where: { portfolioSnapshotId: snapshotId },
    }),
    ...aggregate.assetGroups.map((group) =>
      prisma.portfolioAssetGroupSnapshot.create({
        data: {
          portfolioSnapshotId: snapshotId,
          portfolioAssetGroupId:
            group.isSynthetic || group.id.startsWith("__") ? null : group.id,
          name: group.name,
          targetWeight: toDecimal(group.targetWeight),
          currentWeight: toDecimal(group.currentWeight),
          investedAmount: toDecimal(group.investedAmount),
          marketValue: toDecimal(group.marketValue),
          profitAmount: toDecimal(group.profitAmount),
          profitRate: toDecimal(group.profitRate),
          buyAmount: toDecimal(group.buyAmount),
          sellAmount: toDecimal(group.sellAmount),
        },
      }),
    ),
    ...aggregate.accounts.map((account) =>
      prisma.portfolioAccountSnapshot.create({
        data: {
          portfolioSnapshotId: snapshotId,
          portfolioAccountId: account.id.startsWith("__") ? null : account.id,
          name: account.name,
          displayId: account.displayId || null,
          investedAmount: toDecimal(account.investedAmount),
          marketValue: toDecimal(account.marketValue),
          cashValue: toDecimal(account.cashBalance),
        },
      }),
    ),
    ...aggregate.assetGroups.flatMap((group) =>
      group.items.map((item) =>
        prisma.portfolioHoldingSnapshot.create({
          data: {
            portfolioSnapshotId: snapshotId,
            portfolioHoldingId: null,
            portfolioAssetGroupId:
              item.groupId && !item.groupId.startsWith("__") ? item.groupId : null,
            investmentItemId: item.linkedInvestmentItemId,
            code: item.code,
            name: item.name,
            quantity: toDecimal(item.quantity),
            averagePrice: toDecimal(item.averagePrice),
            currentPrice: toDecimal(item.currentPrice),
            currency: item.currency,
            investedAmount: toDecimal(item.investedAmount),
            marketValue: toDecimal(item.marketValue),
            profitAmount: toDecimal(item.profitAmount),
            profitRate: toDecimal(item.profitRate),
          },
        }),
      ),
    ),
  ]);

  revalidatePortfolioViews();
}
