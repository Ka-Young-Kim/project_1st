import { cookies } from "next/headers";

import { PORTFOLIO_SELECTION_COOKIE } from "@/features/portfolios/lib/selection";
import { prisma } from "@/lib/prisma";

export async function getPortfolios() {
  let portfolios = await prisma.portfolio.findMany({
    include: {
      _count: {
        select: {
          items: true,
          logs: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
  });

  if (portfolios.length === 0) {
    const defaultPortfolio = await prisma.portfolio.create({
      data: {
        name: "기본 포트폴리오",
        description: "초기 데이터 이관용 기본 포트폴리오",
      },
    });
    portfolios = [
      {
        ...defaultPortfolio,
        _count: {
          items: 0,
          logs: 0,
        },
      },
    ];
  }

  const preferredPortfolio = [...portfolios].sort((left, right) => {
    const leftWeight = left._count.items + left._count.logs;
    const rightWeight = right._count.items + right._count.logs;

    if (rightWeight !== leftWeight) {
      return rightWeight - leftWeight;
    }

    return left.createdAt.getTime() - right.createdAt.getTime();
  })[0];

  const defaultPortfolioId = preferredPortfolio.id;
  await Promise.all([
    prisma.investmentItem.updateMany({
      where: { portfolioId: null },
      data: { portfolioId: defaultPortfolioId },
    }),
    prisma.investmentLog.updateMany({
      where: { portfolioId: null },
      data: { portfolioId: defaultPortfolioId },
    }),
  ]);

  return portfolios.map((portfolio) => ({
    id: portfolio.id,
    name: portfolio.name,
    description: portfolio.description,
  }));
}

export async function resolvePortfolioId(portfolioId?: string) {
  const portfolios = await getPortfolios();
  const cookieStore = await cookies();
  const lastSelectedPortfolioId = cookieStore.get(PORTFOLIO_SELECTION_COOKIE)?.value;
  const preferredPortfolio =
    portfolios.find((item) => item.id === lastSelectedPortfolioId) ?? portfolios[0] ?? null;
  const activePortfolio =
    portfolios.find((item) => item.id === portfolioId) ?? preferredPortfolio;

  return {
    portfolios,
    activePortfolio,
  };
}
