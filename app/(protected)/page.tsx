import { PageHeader } from "@/components/ui/page-header";
import { HoldingsList } from "@/features/dashboard/components/holdings-list";
import { SummaryCards } from "@/features/dashboard/components/summary-cards";
import { getDashboardSummary } from "@/features/dashboard/queries/get-dashboard-summary";
import { resolvePortfolioId } from "@/features/portfolios/queries/get-portfolios";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function DashboardPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const portfolioId = Array.isArray(searchParams.portfolio)
    ? searchParams.portfolio[0]
    : searchParams.portfolio;
  const { activePortfolio } = await resolvePortfolioId(portfolioId);
  const summary = await getDashboardSummary(activePortfolio?.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Today"
        title="오늘의 재테크"
        description={
          activePortfolio
            ? `현재 포트폴리오 ${activePortfolio.name} 기준으로 보유 종목, 거래 흐름, 오늘 처리할 할 일을 한 번에 확인합니다.`
            : "현재 포트폴리오 기준 보유 종목, 거래 흐름, 오늘 처리할 할 일을 한 번에 확인합니다."
        }
      />

      <SummaryCards
        summary={{
          incompleteTodoCount: summary.incompleteTodoCount,
          dueTodayCount: summary.dueTodayCount,
          monthlyTradeCount: summary.monthlyTradeCount,
          totalTodoCount: summary.totalTodoCount,
        }}
      />

      <HoldingsList items={summary.holdings} />
    </div>
  );
}
