export type HoldingQuote = {
  price: number;
  currency: string;
  source: "last-trade" | "live" | "delayed";
  asOf: string | null;
};

export type HoldingQuoteRequest = {
  code: string;
  quoteSymbol: string;
  exchange: string | null;
  currency: string;
};

export type PortfolioHoldingEntryInput = {
  id: string;
  symbol: string;
  tradeDate: string | Date;
  action: "buy" | "sell";
  quantity: string;
  price: string;
  reason: string;
  review: string | null;
  investmentItemId: string | null;
  investmentItem: {
    code: string;
    name: string;
    quoteSymbol?: string | null;
    exchange?: string | null;
    currency?: string | null;
  } | null;
};

export type PortfolioHoldingSummary = {
  code: string;
  name: string;
  averagePrice: string;
  currentPrice: string;
  quantity: string;
  profitRate: string;
  currency: string;
  usdToKrwRate: number | null;
  priceSource: "last-trade" | "live" | "delayed";
  priceUpdatedAt: string | null;
  entries: Array<{
    id: string;
    tradeDate: string;
    action: "buy" | "sell";
    quantity: string;
    price: string;
    reason: string;
    review: string | null;
  }>;
};

type HoldingAccumulator = {
  id: string;
  code: string;
  name: string;
  quoteSymbol: string;
  exchange: string | null;
  quantity: number;
  costBasis: number;
  averagePrice: number;
  currentPrice: number;
  currency: string;
  priceSource: "last-trade";
  priceUpdatedAt: string | null;
  updatedAt: number;
  entries: PortfolioHoldingSummary["entries"];
};

function formatHoldingNumber(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

function toIsoDate(value: string | Date) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function aggregateHoldingEntries(entries: PortfolioHoldingEntryInput[]) {
  const holdingsMap = new Map<string, HoldingAccumulator>();

  entries.forEach((entry) => {
    const quantity = Number(entry.quantity);
    const price = Number(entry.price);
    const tradeDate = toIsoDate(entry.tradeDate);
    const key = entry.investmentItemId ?? entry.symbol;
    const existing = holdingsMap.get(key) ?? {
      id: key,
      code: entry.investmentItem?.code ?? entry.symbol,
      name: entry.investmentItem?.name ?? entry.symbol,
      quoteSymbol:
        entry.investmentItem?.quoteSymbol ??
        entry.investmentItem?.code ??
        entry.symbol,
      exchange: entry.investmentItem?.exchange ?? null,
      quantity: 0,
      costBasis: 0,
      averagePrice: 0,
      currentPrice: price,
      currency: entry.investmentItem?.currency ?? "KRW",
      priceSource: "last-trade" as const,
      priceUpdatedAt: tradeDate,
      updatedAt: new Date(tradeDate).getTime(),
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
    existing.updatedAt = new Date(tradeDate).getTime();
    existing.entries.push({
      id: entry.id,
      tradeDate,
      action: entry.action,
      quantity: entry.quantity,
      price: entry.price,
      reason: entry.reason,
      review: entry.review,
    });
    holdingsMap.set(key, existing);
  });

  return Array.from(holdingsMap.values());
}

export function collectHoldingQuoteRequests(
  entries: PortfolioHoldingEntryInput[],
): HoldingQuoteRequest[] {
  return aggregateHoldingEntries(entries)
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      code: item.code,
      quoteSymbol: item.quoteSymbol,
      exchange: item.exchange,
      currency: item.currency,
    }));
}

export function buildPortfolioHoldings({
  entries,
  quoteByCode,
  usdToKrwRate,
}: {
  entries: PortfolioHoldingEntryInput[];
  quoteByCode: Map<string, HoldingQuote>;
  usdToKrwRate: number | null;
}): PortfolioHoldingSummary[] {
  return aggregateHoldingEntries(entries)
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
        averagePrice: formatHoldingNumber(item.averagePrice),
        currentPrice: formatHoldingNumber(currentPrice),
        quantity: formatHoldingNumber(item.quantity),
        profitRate: formatHoldingNumber(profitRate),
        currency: liveQuote?.currency ?? item.currency,
        usdToKrwRate,
        priceSource: liveQuote?.source ?? item.priceSource,
        priceUpdatedAt: liveQuote?.asOf ?? item.priceUpdatedAt,
        entries: [...item.entries].sort(
          (left, right) =>
            new Date(right.tradeDate).getTime() -
            new Date(left.tradeDate).getTime(),
        ),
      };
    });
}
