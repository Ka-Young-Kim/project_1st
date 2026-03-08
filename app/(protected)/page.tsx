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
  const completionRate =
    summary.totalTodoCount === 0
      ? 0
      : Math.round(
          ((summary.totalTodoCount - summary.incompleteTodoCount) /
            summary.totalTodoCount) *
            100,
        );
  const focusMessage =
    summary.dueTodayCount > 0
      ? `오늘 마감 ${summary.dueTodayCount}건을 우선 처리하세요.`
      : "오늘 마감 TODO는 없습니다. 중장기 항목을 정리할 시간입니다.";

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
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[16px] border border-[var(--border)] bg-white/3 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                Focus
              </p>
              <p className="mt-3 text-lg font-semibold">{focusMessage}</p>
            </div>
            <div className="rounded-[16px] border border-[var(--border)] bg-white/3 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                Completion
              </p>
              <p className="mt-3 text-3xl font-bold">{completionRate}%</p>
              <p className="mt-2 text-sm text-[var(--muted)]">완료된 TODO 비중</p>
            </div>
            <div className="rounded-[16px] border border-[var(--border)] bg-white/3 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                Activity
              </p>
              <p className="mt-3 text-3xl font-bold">{summary.monthlyTradeCount}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">이번 달 거래 로그</p>
            </div>
          </div>
        </div>
      </section>

      <HoldingsList items={summary.holdings} />
    </div>
  );
}
