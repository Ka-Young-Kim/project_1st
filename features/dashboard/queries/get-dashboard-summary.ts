import { prisma } from "@/lib/prisma";
import { getCurrentMonthRangeInSeoul, getTodayRangeInSeoul } from "@/lib/utils";

export async function getDashboardSummary() {
  const todayRange = getTodayRangeInSeoul();
  const monthRange = getCurrentMonthRangeInSeoul();

  const [
    incompleteTodoCount,
    dueTodayCount,
    monthlyTradeCount,
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
      orderBy: [{ tradeDate: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
  ]);

  return {
    incompleteTodoCount,
    dueTodayCount,
    monthlyTradeCount,
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
