import { Banner } from "@/components/ui/banner";
import { SummaryCards } from "@/features/dashboard/components/summary-cards";
import { UpcomingTodos } from "@/features/dashboard/components/upcoming-todos";
import { RecentTrades } from "@/features/dashboard/components/recent-trades";
import { getDashboardSummary } from "@/features/dashboard/queries/get-dashboard-summary";
import { getStatusMessage } from "@/lib/constants";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function DashboardPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusParam = Array.isArray(searchParams.status)
    ? searchParams.status[0]
    : searchParams.status;
  const banner = getStatusMessage(statusParam);
  const summary = await getDashboardSummary();

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3">
        <p className="status-badge bg-[var(--accent-soft)] text-[var(--accent-strong)]">
          Seoul / KRW / Personal Vault
        </p>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              오늘의 재무 루틴
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
              미완료 TODO, 최근 거래 기록, 월간 활동량을 한 화면에서
              확인합니다.
            </p>
          </div>
        </div>
      </section>

      {banner ? <Banner tone={banner.tone}>{banner.message}</Banner> : null}

      <SummaryCards summary={summary} />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <UpcomingTodos items={summary.upcomingTodos} />
        <RecentTrades items={summary.recentTrades} />
      </div>
    </div>
  );
}
