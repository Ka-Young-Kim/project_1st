import { prisma } from "@/lib/prisma";
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
  ]);

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
  };
}
