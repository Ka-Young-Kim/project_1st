import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/portfolios/queries/get-portfolios", () => ({
  resolvePortfolioId: vi.fn(),
}));

vi.mock("@/features/portfolios/queries/get-portfolio-management", () => ({
  getPortfolioManagement: vi.fn(),
}));

vi.mock(
  "@/features/portfolios/components/portfolio-account-management",
  () => ({
    PortfolioAccountsOverview: () =>
      React.createElement(
        "div",
        { "data-testid": "accounts-overview" },
        "accounts overview",
      ),
  }),
);

vi.mock("@/features/portfolios/components/portfolio-management-board", () => ({
  PortfolioManagementBoard: () =>
    React.createElement(
      "div",
      { "data-testid": "portfolio-management-board" },
      "portfolio board",
    ),
}));

vi.mock("@/components/ui/empty-state", () => ({
  EmptyState: ({ title }: { title: string }) =>
    React.createElement("div", { "data-testid": "empty-state" }, title),
}));

describe("PortfolioWorkspacePage", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("renders the portfolio board without the accounts overview card", async () => {
    const { resolvePortfolioId } =
      await import("@/features/portfolios/queries/get-portfolios");
    const { getPortfolioManagement } =
      await import("@/features/portfolios/queries/get-portfolio-management");
    const { default: PortfolioWorkspacePage } =
      await import("@/app/(protected)/page");

    vi.mocked(resolvePortfolioId).mockResolvedValue({
      portfolios: [
        {
          id: "portfolio-1",
          name: "기본 포트폴리오",
          description: null,
        },
      ],
      activePortfolio: {
        id: "portfolio-1",
        name: "기본 포트폴리오",
        description: null,
      },
    });
    vi.mocked(getPortfolioManagement).mockResolvedValue({
      portfolio: {
        id: "portfolio-1",
      },
    } as Awaited<ReturnType<typeof getPortfolioManagement>>);

    const markup = renderToStaticMarkup(
      await PortfolioWorkspacePage({
        searchParams: Promise.resolve({}),
      }),
    );

    expect(markup).toContain('data-testid="portfolio-management-board"');
    expect(markup).not.toContain('data-testid="accounts-overview"');
  });
});
