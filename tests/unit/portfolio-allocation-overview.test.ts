import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PortfolioAllocationOverview } from "@/features/portfolios/components/portfolio-allocation-overview";

describe("PortfolioAllocationOverview", () => {
  it("renders large donuts with outside labels instead of a legend", () => {
    const markup = renderToStaticMarkup(
      React.createElement(PortfolioAllocationOverview, {
        assetGroups: [
          {
            id: "stocks",
            name: "국내주식",
            targetWeight: 45,
            currentWeight: 67.9,
            investedAmount: 0,
            marketValue: 0,
            profitAmount: 0,
            profitRate: 0,
            buyAmount: 0,
            sellAmount: 0,
            items: [],
            isSynthetic: false,
          },
          {
            id: "global",
            name: "해외ETF",
            targetWeight: 25,
            currentWeight: 1.3,
            investedAmount: 0,
            marketValue: 0,
            profitAmount: 0,
            profitRate: 0,
            buyAmount: 0,
            sellAmount: 0,
            items: [],
            isSynthetic: false,
          },
        ],
      }),
    );

    expect(markup).not.toContain("주요 비중");
    expect(markup).not.toContain("자산군 범례");
    expect(markup).not.toContain("최대 편차");
    expect(markup).toContain("목표 구성");
    expect(markup).toContain("현재 구성");
    expect(markup).toContain("국내주식");
    expect(markup).toContain('aria-label="목표 구성 도넛 차트"');
    expect(markup).toContain('aria-label="현재 구성 도넛 차트"');
    expect(markup).toContain("<svg");
    expect(markup).toContain("<line");
  });
});
