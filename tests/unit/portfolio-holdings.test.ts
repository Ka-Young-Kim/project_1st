import { describe, expect, it } from "vitest";

import { buildPortfolioHoldings } from "@/features/portfolios/lib/holdings";

describe("portfolio holdings aggregation", () => {
  it("keeps only open positions, applies live quotes, and sorts by latest trade", () => {
    const holdings = buildPortfolioHoldings({
      entries: [
        {
          id: "log-1",
          symbol: "NVDA",
          tradeDate: "2026-03-01T00:00:00.000Z",
          action: "buy",
          quantity: "3",
          price: "100",
          reason: "first buy",
          review: null,
          investmentItemId: "item-nvda",
          investmentItem: {
            code: "NVDA",
            name: "엔비디아",
            quoteSymbol: "NVDA",
            exchange: "NASDAQ",
            currency: "USD",
          },
        },
        {
          id: "log-2",
          symbol: "AAPL",
          tradeDate: "2026-03-10T00:00:00.000Z",
          action: "buy",
          quantity: "2",
          price: "200",
          reason: "apple buy",
          review: "watch momentum",
          investmentItemId: "item-aapl",
          investmentItem: {
            code: "AAPL",
            name: "애플",
            quoteSymbol: "AAPL",
            exchange: "NASDAQ",
            currency: "USD",
          },
        },
        {
          id: "log-3",
          symbol: "NVDA",
          tradeDate: "2026-03-12T00:00:00.000Z",
          action: "sell",
          quantity: "1",
          price: "120",
          reason: "trim position",
          review: null,
          investmentItemId: "item-nvda",
          investmentItem: {
            code: "NVDA",
            name: "엔비디아",
            quoteSymbol: "NVDA",
            exchange: "NASDAQ",
            currency: "USD",
          },
        },
        {
          id: "log-4",
          symbol: "TSLA",
          tradeDate: "2026-03-08T00:00:00.000Z",
          action: "buy",
          quantity: "1",
          price: "300",
          reason: "test closed position",
          review: null,
          investmentItemId: null,
          investmentItem: null,
        },
        {
          id: "log-5",
          symbol: "TSLA",
          tradeDate: "2026-03-09T00:00:00.000Z",
          action: "sell",
          quantity: "1",
          price: "310",
          reason: "exit position",
          review: null,
          investmentItemId: null,
          investmentItem: null,
        },
      ],
      quoteByCode: new Map([
        [
          "NVDA",
          {
            price: 150,
            currency: "USD",
            source: "live",
            asOf: "2026-03-15T00:00:00.000Z",
          },
        ],
        [
          "AAPL",
          {
            price: 180,
            currency: "USD",
            source: "delayed",
            asOf: "2026-03-14T00:00:00.000Z",
          },
        ],
      ]),
      usdToKrwRate: 1450,
    });

    expect(holdings).toHaveLength(2);
    expect(holdings.map((item) => item.code)).toEqual(["NVDA", "AAPL"]);
    expect(holdings[0]).toMatchObject({
      code: "NVDA",
      name: "엔비디아",
      quantity: "2",
      averagePrice: "100",
      currentPrice: "150",
      profitRate: "50",
      currency: "USD",
      priceSource: "live",
      priceUpdatedAt: "2026-03-15T00:00:00.000Z",
      usdToKrwRate: 1450,
    });
    expect(holdings[0].entries.map((entry) => entry.id)).toEqual([
      "log-3",
      "log-1",
    ]);
    expect(holdings[1]).toMatchObject({
      code: "AAPL",
      name: "애플",
      quantity: "2",
      averagePrice: "200",
      currentPrice: "180",
      profitRate: "-10",
      currency: "USD",
      priceSource: "delayed",
    });
  });
});
