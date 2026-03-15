import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { StatusToast } from "@/components/ui/status-toast";
import { Card } from "@/components/ui/card";
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
    <div className="space-y-8">
      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}

      {activePortfolio ? (
        <div className="flex justify-end">
          <Link
            href={`/portfolios?${new URLSearchParams({ portfolio: activePortfolio.id }).toString()}`}
            className="inline-flex min-h-11 items-center justify-center rounded-[1rem] border border-[rgba(110,168,254,0.32)] bg-[rgba(110,168,254,0.14)] px-5 py-3 text-sm font-semibold text-[#dce7ff] transition hover:bg-[rgba(110,168,254,0.22)]"
          >
            포트폴리오 구성으로 돌아가기
          </Link>
        </div>
      ) : null}

      {managementData ? (
        <div className="space-y-4">
          <Card className="px-5 py-4">
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
          </Card>
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
