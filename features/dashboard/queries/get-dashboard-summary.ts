import { prisma } from "@/lib/prisma";
import { getLatestQuotes, getUsdToKrwRate } from "@/lib/market-data/quote-service";
import { getCurrentMonthRangeInSeoul, getTodayRangeInSeoul } from "@/lib/utils";

export async function getDashboardSummary(portfolioId?: string) {
  const todayRange = getTodayRangeInSeoul();
  const monthRange = getCurrentMonthRangeInSeoul();
  const monthLabel = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replaceAll("-", " / ");

  const [
    incompleteTodoCount,
    dueTodayCount,
    monthlyTradeCount,
    monthlyBuyCount,
    monthlySellCount,
    totalTodoCount,
    upcomingTodos,
    recentTrades,
    allTrades,
  ] = await Promise.all([
    prisma.todo.count({ where: { completed: false } }),
    prisma.todo.count({
      where: {
        completed: false,
        dueDate: {
          gte: todayRange.start,
          lt: todayRange.end,
        },
      },
    }),
    prisma.investmentLog.count({
      where: {
        ...(portfolioId ? { portfolioId } : {}),
        tradeDate: {
          gte: monthRange.start,
          lt: monthRange.end,
        },
      },
    }),
    prisma.investmentLog.count({
      where: {
        ...(portfolioId ? { portfolioId } : {}),
        action: "buy",
        tradeDate: {
          gte: monthRange.start,
          lt: monthRange.end,
        },
      },
    }),
    prisma.investmentLog.count({
      where: {
        ...(portfolioId ? { portfolioId } : {}),
        action: "sell",
        tradeDate: {
          gte: monthRange.start,
          lt: monthRange.end,
        },
      },
    }),
    prisma.todo.count(),
    prisma.todo.findMany({
      where: { completed: false },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      take: 5,
    }),
    prisma.investmentLog.findMany({
      where: portfolioId ? { portfolioId } : undefined,
      include: {
        investmentItem: true,
      },
      orderBy: [{ tradeDate: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
    prisma.investmentLog.findMany({
      where: portfolioId ? { portfolioId } : undefined,
      include: {
        investmentItem: true,
      },
      orderBy: [{ tradeDate: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  const holdingsMap = new Map<
    string,
    {
      id: string;
      code: string;
      name: string;
      quantity: number;
      costBasis: number;
      averagePrice: number;
      currentPrice: number;
      currency: string;
      priceSource: "last-trade" | "live" | "delayed";
      priceUpdatedAt: string | null;
      updatedAt: number;
      entries: Array<{
        id: string;
        tradeDate: string;
        action: "buy" | "sell";
        quantity: string;
        price: string;
        reason: string;
        review: string | null;
      }>;
    }
  >();

  allTrades.forEach((entry) => {
    const quantity = Number(entry.quantity);
    const price = Number(entry.price);
    const key = entry.investmentItemId ?? entry.symbol;
    const existing =
      holdingsMap.get(key) ?? {
        id: key,
        code: entry.investmentItem?.code ?? entry.symbol,
        name: entry.investmentItem?.name ?? entry.symbol,
        quantity: 0,
        costBasis: 0,
        averagePrice: 0,
        currentPrice: price,
        currency: entry.investmentItem?.currency ?? "KRW",
        priceSource: "last-trade" as const,
        priceUpdatedAt: entry.tradeDate.toISOString(),
        updatedAt: entry.tradeDate.getTime(),
        entries: [],
      };

    if (entry.action === "buy") {
      existing.quantity += quantity;
      existing.costBasis += quantity * price;
    } else if (existing.quantity > 0) {
      const averagePrice =
        existing.quantity === 0 ? 0 : existing.costBasis / existing.quantity;
      const sellQuantity = Math.min(quantity, existing.quantity);
      existing.quantity -= sellQuantity;
      existing.costBasis = Math.max(
        0,
        existing.costBasis - averagePrice * sellQuantity,
      );
    }

    existing.averagePrice =
      existing.quantity > 0 ? existing.costBasis / existing.quantity : 0;
    existing.currentPrice = price;
    existing.updatedAt = entry.tradeDate.getTime();
    existing.entries.push({
      id: entry.id,
      tradeDate: entry.tradeDate.toISOString(),
      action: entry.action,
      quantity: entry.quantity.toString(),
      price: entry.price.toString(),
      reason: entry.reason,
      review: entry.review,
    });
    holdingsMap.set(key, existing);
  });

  const quoteByCode = await getLatestQuotes(
    Array.from(holdingsMap.values())
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        code: item.code,
        quoteSymbol:
          allTrades.find((entry) => (entry.investmentItemId ?? entry.symbol) === item.id)
            ?.investmentItem?.quoteSymbol ?? item.code,
        exchange:
          allTrades.find((entry) => (entry.investmentItemId ?? entry.symbol) === item.id)
            ?.investmentItem?.exchange ?? null,
        currency: item.currency,
      })),
  );
  const needsUsdToKrw = Array.from(holdingsMap.values()).some((item) => {
    if (item.quantity <= 0) {
      return false;
    }

    const resolvedCurrency = quoteByCode.get(item.code)?.currency ?? item.currency;
    return resolvedCurrency === "USD";
  });
  const usdToKrwRate = needsUsdToKrw ? await getUsdToKrwRate().catch(() => null) : null;

  const holdings = Array.from(holdingsMap.values())
    .filter((item) => item.quantity > 0)
    .sort((left, right) => right.updatedAt - left.updatedAt)
    .map((item) => {
      const liveQuote = quoteByCode.get(item.code);
      const currentPrice = liveQuote?.price ?? item.currentPrice;
      const profitRate =
        item.averagePrice > 0
          ? ((currentPrice - item.averagePrice) / item.averagePrice) * 100
          : 0;

      return {
        code: item.code,
        name: item.name,
        averagePrice: item.averagePrice.toFixed(2).replace(/\.?0+$/, ""),
        currentPrice: currentPrice.toFixed(2).replace(/\.?0+$/, ""),
        quantity: item.quantity.toFixed(2).replace(/\.?0+$/, ""),
        profitRate: profitRate.toFixed(2).replace(/\.?0+$/, ""),
        currency: liveQuote?.currency ?? item.currency,
        usdToKrwRate,
        priceSource: liveQuote?.source ?? item.priceSource,
        priceUpdatedAt: liveQuote?.asOf ?? item.priceUpdatedAt,
        entries: item.entries
          .sort(
            (left, right) =>
              new Date(right.tradeDate).getTime() -
              new Date(left.tradeDate).getTime(),
          )
          .map((entry) => ({
            id: entry.id,
            tradeDate: entry.tradeDate,
            action: entry.action,
            quantity: entry.quantity,
            price: entry.price,
            reason: entry.reason,
            review: entry.review,
          })),
      };
    });

  return {
    monthLabel,
    incompleteTodoCount,
    dueTodayCount,
    monthlyTradeCount,
    monthlyBuyCount,
    monthlySellCount,
    totalTodoCount,
    upcomingTodos: upcomingTodos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      priority: todo.priority,
      dueDate: todo.dueDate,
    })),
    recentTrades: recentTrades.map((entry) => ({
      id: entry.id,
      symbol: entry.symbol,
      action: entry.action,
      tradeDate: entry.tradeDate,
      quantity: entry.quantity.toString(),
      price: entry.price.toString(),
      reason: entry.reason,
    })),
    holdings,
  };
}
