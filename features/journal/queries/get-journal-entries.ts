import { prisma } from "@/lib/prisma";

export async function getJournalEntries() {
  const entries = await prisma.investmentLog.findMany({
    orderBy: [{ tradeDate: "desc" }, { createdAt: "desc" }],
  });

  return entries.map((entry) => ({
    id: entry.id,
    tradeDate: entry.tradeDate,
    symbol: entry.symbol,
    action: entry.action,
    quantity: entry.quantity.toString(),
    price: entry.price.toString(),
    reason: entry.reason,
    review: entry.review,
    updatedAt: entry.updatedAt,
  }));
}
