import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { StatusToast } from "@/components/ui/status-toast";
import { PortfolioSnapshotHistory } from "@/features/portfolios/components/portfolio-snapshot-history";
import { getPortfolioManagement } from "@/features/portfolios/queries/get-portfolio-management";
import { resolvePortfolioId } from "@/features/portfolios/queries/get-portfolios";
import { getStatusMessage } from "@/lib/constants";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PortfolioSnapshotsPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusParam = Array.isArray(searchParams.status)
    ? searchParams.status[0]
    : searchParams.status;
  const portfolioId = Array.isArray(searchParams.portfolio)
    ? searchParams.portfolio[0]
    : searchParams.portfolio;
  const banner = getStatusMessage(statusParam);
  const { activePortfolio } = await resolvePortfolioId(portfolioId);
  const managementData = activePortfolio
    ? await getPortfolioManagement(activePortfolio.id)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="status-badge bg-white/80 text-[var(--accent-strong)]">
            Snapshot View
          </p>
          <h1 className="text-3xl font-bold tracking-tight">스냅샷 관리</h1>
          <p className="text-sm text-[var(--muted)]">
            선택한 포트폴리오의 기록된 스냅샷을 새 창에서 확인합니다.
          </p>
        </div>
        {activePortfolio ? (
          <Link
            href={`/portfolios?${new URLSearchParams({ portfolio: activePortfolio.id }).toString()}`}
            className="inline-flex items-center justify-center rounded-[1rem] border border-[rgba(110,168,254,0.32)] bg-[rgba(110,168,254,0.14)] px-5 py-3 text-sm font-semibold text-[#dce7ff] transition hover:bg-[rgba(110,168,254,0.22)]"
          >
            포트폴리오 구성으로 돌아가기
          </Link>
        ) : null}
      </div>

      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}

      {managementData ? (
        <div className="space-y-4">
          <div className="rounded-[1.4rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,29,53,.92),rgba(17,26,48,.94))] px-5 py-4 text-white shadow-[0_14px_40px_rgba(0,0,0,.22)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
              Selected Portfolio
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {managementData.portfolio.name}
            </h2>
            {managementData.portfolio.description ? (
              <p className="mt-2 text-sm leading-6 text-[#8fb0ec]">
                {managementData.portfolio.description}
              </p>
            ) : null}
          </div>
          <PortfolioSnapshotHistory snapshots={managementData.snapshots} />
        </div>
      ) : (
        <EmptyState
          title="선택된 포트폴리오가 없습니다"
          description="상단 포트폴리오 선택기에서 포트폴리오를 고른 뒤 다시 열어 주세요."
        />
      )}
    </div>
  );
}
