import { prisma } from "@/lib/prisma";
import { ensurePortfolioAccounts } from "@/features/portfolios/services/portfolio-management-service";

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
    orderBy: [{ active: "desc" }, { updatedAt: "desc" }],
  });

  if (portfolios.length === 0) {
    const defaultPortfolio = await prisma.portfolio.create({
      data: {
        name: "기본 포트폴리오",
        description: "초기 데이터 이관용 기본 포트폴리오",
        active: true,
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

  const activePortfolios = portfolios.filter((item) => item.active);
  const needsActiveNormalization =
    activePortfolios.length !== 1 || activePortfolios[0]?.id !== preferredPortfolio.id;

  if (needsActiveNormalization) {
    await prisma.$transaction([
      prisma.portfolio.updateMany({
        where: { active: true },
        data: { active: false },
      }),
      prisma.portfolio.update({
        where: { id: preferredPortfolio.id },
        data: { active: true },
      }),
    ]);

    portfolios = await prisma.portfolio.findMany({
      include: {
        _count: {
          select: {
            items: true,
            logs: true,
          },
        },
      },
      orderBy: [{ active: "desc" }, { updatedAt: "desc" }],
    });
  }

  await Promise.all(portfolios.map((portfolio) => ensurePortfolioAccounts(portfolio.id)));

  return portfolios.map((portfolio) => ({
    id: portfolio.id,
    name: portfolio.name,
    description: portfolio.description,
    active: portfolio.active,
  }));
}

export async function resolvePortfolioId(portfolioId?: string) {
  const portfolios = await getPortfolios();
  const preferredPortfolio =
    portfolios.find((item) => item.active) ?? portfolios[0] ?? null;
  const activePortfolio =
    portfolios.find((item) => item.id === portfolioId) ?? preferredPortfolio;

  return {
    portfolios,
    activePortfolio,
  };
}
