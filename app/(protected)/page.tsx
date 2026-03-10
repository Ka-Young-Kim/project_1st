import { HoldingsList } from "@/features/dashboard/components/holdings-list";
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
      <section className="glass-panel relative overflow-hidden rounded-[22px] p-6 md:p-8">
        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,rgba(110,168,254,0.12),transparent_45%),radial-gradient(circle_at_top_right,rgba(124,242,201,0.1),transparent_35%)]" />
        <div className="relative">
          <p className="status-badge border border-[rgba(110,168,254,0.22)] bg-[rgba(110,168,254,0.12)] text-[#cfe1ff]">
            Today
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            오늘의 재태크
          </h1>
          {activePortfolio ? (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
              현재 포트폴리오: {activePortfolio.name}
            </p>
          ) : null}
        </div>
      </section>

      <HoldingsList items={summary.holdings} />
    </div>
  );
}
