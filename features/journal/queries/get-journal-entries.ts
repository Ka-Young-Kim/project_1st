import { prisma } from "@/lib/prisma";

export async function getJournalEntries() {
  const entries = await prisma.investmentLog.findMany({
    include: {
      investmentItem: true,
    },
    orderBy: [{ tradeDate: "desc" }, { createdAt: "desc" }],
  });

  return entries.map((entry) => ({
    id: entry.id,
    tradeDate: entry.tradeDate,
    investmentItemId: entry.investmentItemId,
    itemName: entry.investmentItem?.name ?? null,
    symbol: entry.symbol,
    action: entry.action,
    quantity: entry.quantity.toString(),
    price: entry.price.toString(),
    reason: entry.reason,
    review: entry.review,
    updatedAt: entry.updatedAt,
  }));
}
