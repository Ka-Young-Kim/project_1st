import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import {
  PortfolioAccountInput,
  PortfolioAccountUpdateInput,
  PortfolioAssetGroupInput,
  PortfolioAssetGroupUpdateInput,
  PortfolioHoldingAssignmentInput,
} from "@/features/portfolios/schemas/portfolio-management";
import { getLatestQuotes, getUsdToKrwRate } from "@/lib/market-data/quote-service";
import { prisma } from "@/lib/prisma";
import { getTodayRangeInSeoul } from "@/lib/utils";

type PortfolioAggregate = Awaited<ReturnType<typeof getPortfolioManagementData>>;
export type PortfolioManagementData = PortfolioAggregate;

type AccountBucket = {
  accountId: string | null;
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

export async function createPortfolioAccount(input: PortfolioAccountInput) {
  await prisma.portfolioAccount.create({
    data: {
      portfolioId: input.portfolioId,
      name: input.name,
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
    prisma.portfolioAssetGroup.delete({
      where: { id },
    }),
  ]);

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
  await ensurePortfolioAccounts(portfolioId);

  const [portfolio, items, holdings, logs, snapshots] = await Promise.all([
    prisma.portfolio.findUniqueOrThrow({
      where: { id: portfolioId },
      include: {
        accounts: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
        assetGroups: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    }),
    prisma.investmentItem.findMany({
      where: { portfolioId },
      orderBy: [{ active: "desc" }, { name: "asc" }],
    }),
    prisma.portfolioHolding.findMany({
      where: { portfolioId },
      include: {
        investmentItem: true,
        portfolioAssetGroup: true,
      },
      orderBy: [{ createdAt: "asc" }],
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
  ]);

  const accountMap = new Map(
    portfolio.accounts.map((account) => [account.id, account]),
  );
  const holdingMap = new Map(
    holdings.map((holding) => [holding.investmentItemId, holding]),
  );

  const accountBuckets = new Map<string, AccountBucket>();
  for (const log of logs) {
    if (!log.investmentItemId) {
      continue;
    }

    const accountId = log.portfolioAccountId ?? "__unassigned__";
    const key = `${accountId}:${log.investmentItemId}`;
    const current = accountBuckets.get(key) ?? {
      accountId: log.portfolioAccountId,
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
    accountBuckets.set(key, current);
  }

  const holdingsByItemId = new Map(
    holdings.filter((holding) => holding.active).map((holding) => [holding.investmentItemId, holding]),
  );
  const trackedItems = items.filter((item) =>
    Array.from(accountBuckets.keys()).some((key) => key.endsWith(`:${item.id}`)),
  );
  const quoteRequests = trackedItems.map((item) => ({
    code: item.code,
    quoteSymbol: item.quoteSymbol ?? item.code,
    exchange: item.exchange ?? null,
    currency: item.currency ?? "KRW",
  }));
  const quoteByCode = await getLatestQuotes(quoteRequests);
  const needsUsdToKrw = trackedItems.some((item) => {
    const liveQuote = quoteByCode.get(item.code);
    return (liveQuote?.currency ?? item.currency ?? "KRW") === "USD";
  });
  const usdToKrwRate = needsUsdToKrw ? await getUsdToKrwRate().catch(() => null) : null;

  const itemSummaries = trackedItems
    .map((item) => {
      const holding = holdingsByItemId.get(item.id) ?? null;
      const buckets = Array.from(accountBuckets.entries())
        .filter(([, bucket]) => bucket.quantity > 0)
        .filter(([key]) => key.endsWith(`:${item.id}`))
        .map(([, bucket]) => bucket);

      const quantity = buckets.reduce((sum, bucket) => sum + bucket.quantity, 0);
      const investedAmount = buckets.reduce((sum, bucket) => sum + bucket.costBasis, 0);
      const averagePrice = quantity > 0 ? investedAmount / quantity : 0;
      const liveQuote = quoteByCode.get(item.code);
      const resolvedCurrency = liveQuote?.currency ?? item.currency ?? "KRW";
      const currentPrice =
        liveQuote?.price ??
        buckets[buckets.length - 1]?.lastTradePrice ??
        0;
      const marketValueBase = quantity * currentPrice;
      const investedAmountKrw = toKrw(investedAmount, resolvedCurrency, usdToKrwRate);
      const marketValueKrw = toKrw(marketValueBase, resolvedCurrency, usdToKrwRate);
      const profitAmount = marketValueKrw - investedAmountKrw;
      const profitRate =
        investedAmountKrw > 0 ? (profitAmount / investedAmountKrw) * 100 : 0;

      const accounts = buckets.map((bucket) => {
        const account = bucket.accountId ? accountMap.get(bucket.accountId) : null;
        const accountMarketValue = toKrw(
          bucket.quantity * currentPrice,
          resolvedCurrency,
          usdToKrwRate,
        );

        return {
          id: bucket.accountId ?? "__unassigned__",
          name: account?.name ?? "미지정 계좌",
          displayId: account?.displayId ?? "",
          quantity: round2(bucket.quantity),
          investedAmount: round2(
            toKrw(bucket.costBasis, resolvedCurrency, usdToKrwRate),
          ),
          marketValue: round2(accountMarketValue),
        };
      });

      return {
        holdingId: holding?.id ?? null,
        investmentItemId: item.id,
        groupId: holding?.portfolioAssetGroupId ?? null,
        groupName: holding?.portfolioAssetGroup?.name ?? "미분류",
        code: item.code,
        name: item.name,
        currency: resolvedCurrency,
        quantity: round2(quantity),
        averagePrice: round2(averagePrice),
        currentPrice: round2(currentPrice),
        investedAmount: round2(investedAmountKrw),
        marketValue: round2(marketValueKrw),
        profitAmount: round2(profitAmount),
        profitRate: round2(profitRate),
        accounts,
      } as const;
    })
    .filter((item) => item.quantity > 0);

  const totalTrackedCash = portfolio.accounts.reduce((sum, account) => {
    if (!account.cashTrackingEnabled) {
      return sum;
    }

    return sum + Number(account.cashBalance);
  }, 0);

  const portfolioInvestedAmount =
    itemSummaries.reduce((sum, item) => sum + item.investedAmount, 0) + totalTrackedCash;
  const portfolioMarketValue =
    itemSummaries.reduce((sum, item) => sum + item.marketValue, 0) + totalTrackedCash;
  const portfolioProfitAmount = portfolioMarketValue - portfolioInvestedAmount;
  const portfolioProfitRate =
    portfolioInvestedAmount > 0
      ? (portfolioProfitAmount / portfolioInvestedAmount) * 100
      : 0;

  const explicitGroups = portfolio.assetGroups.map((group) => {
    const entries = itemSummaries.filter((item) => item.groupId === group.id);
    const investedAmount = entries.reduce((sum, item) => sum + item.investedAmount, 0);
    const marketValue = entries.reduce((sum, item) => sum + item.marketValue, 0);
    const profitAmount = marketValue - investedAmount;
    const profitRate = investedAmount > 0 ? (profitAmount / investedAmount) * 100 : 0;
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
  const syntheticGroups = [];

  if (uncategorizedItems.length > 0) {
    const investedAmount = uncategorizedItems.reduce(
      (sum, item) => sum + item.investedAmount,
      0,
    );
    const marketValue = uncategorizedItems.reduce((sum, item) => sum + item.marketValue, 0);
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

  if (totalTrackedCash > 0) {
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

  const accountSummaries = [
    ...portfolio.accounts.map((account) => {
      const accountItems = itemSummaries.flatMap((item) =>
        item.accounts
          .filter((bucket) => bucket.id === account.id)
          .map((bucket) => ({
            ...bucket,
            code: item.code,
            name: item.name,
          })),
      );
      const investedAmount =
        accountItems.reduce((sum, item) => sum + item.investedAmount, 0) +
        (account.cashTrackingEnabled ? Number(account.cashBalance) : 0);
      const marketValue =
        accountItems.reduce((sum, item) => sum + item.marketValue, 0) +
        (account.cashTrackingEnabled ? Number(account.cashBalance) : 0);

      return {
        id: account.id,
        name: account.name,
        displayId: account.displayId ?? "",
        cashTrackingEnabled: account.cashTrackingEnabled,
        cashBalance: Number(account.cashBalance),
        investedAmount: round2(investedAmount),
        marketValue: round2(marketValue),
        currentWeight: round2(percentOf(marketValue, portfolioMarketValue)),
        items: accountItems,
      };
    }),
    ...(() => {
      const unassignedItems = itemSummaries.flatMap((item) =>
        item.accounts
          .filter((bucket) => bucket.id === "__unassigned__")
          .map((bucket) => ({
            ...bucket,
            code: item.code,
            name: item.name,
          })),
      );

      if (unassignedItems.length === 0) {
        return [];
      }

      const marketValue = unassignedItems.reduce((sum, item) => sum + item.marketValue, 0);
      const investedAmount = unassignedItems.reduce(
        (sum, item) => sum + item.investedAmount,
        0,
      );

      return [
        {
          id: "__unassigned__",
          name: "미지정 계좌",
          displayId: "",
          cashTrackingEnabled: false,
          cashBalance: 0,
          investedAmount: round2(investedAmount),
          marketValue: round2(marketValue),
          currentWeight: round2(percentOf(marketValue, portfolioMarketValue)),
          items: unassignedItems,
        },
      ];
    })(),
  ];

  const managedItems = items.map((item) => {
    const linkedHolding = holdingMap.get(item.id);
    const summary =
      itemSummaries.find((holding) => holding.investmentItemId === item.id) ?? null;

    return {
      id: item.id,
      name: item.name,
      code: item.code,
      category: item.category ?? "other",
      active: item.active,
      isLinked: Boolean(linkedHolding),
      portfolioHoldingId: linkedHolding?.id ?? null,
      portfolioAssetGroupId: linkedHolding?.portfolioAssetGroupId ?? "",
      groupName: linkedHolding?.portfolioAssetGroup?.name ?? "미분류",
      quantity: summary?.quantity ?? 0,
      marketValue: summary?.marketValue ?? 0,
      profitRate: summary?.profitRate ?? 0,
    };
  });

  return {
    portfolio: {
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.description,
      active: portfolio.active,
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
    managedItems,
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
            portfolioHoldingId: item.holdingId,
            portfolioAssetGroupId:
              item.groupId && !item.groupId.startsWith("__") ? item.groupId : null,
            investmentItemId: item.investmentItemId,
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
