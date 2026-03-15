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
