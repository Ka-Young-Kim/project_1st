import { StatusToast } from "@/components/ui/status-toast";
import { EmptyState } from "@/components/ui/empty-state";
import { PortfolioManagementBoard } from "@/features/portfolios/components/portfolio-management-board";
import { getPortfolioManagement } from "@/features/portfolios/queries/get-portfolio-management";
import { resolvePortfolioId } from "@/features/portfolios/queries/get-portfolios";
import { getStatusMessage } from "@/lib/constants";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PortfoliosPage(props: {
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
      <div className="flex flex-col gap-2">
        <p className="status-badge bg-white/80 text-[var(--accent-strong)]">
          Portfolio Setup
        </p>
        <h1 className="text-3xl font-bold tracking-tight">포트폴리오 구성</h1>
        <p className="text-sm text-[var(--muted)]">
          선택한 포트폴리오 내부의 계좌, 자산군, 목표 비율, 리밸런싱, 스냅샷을 설정합니다.
        </p>
      </div>
      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}
      <div className="grid gap-6">
        {managementData ? (
          <PortfolioManagementBoard data={managementData} />
        ) : (
          <EmptyState
            title="선택된 포트폴리오가 없습니다"
            description="상단 아이콘 페이지에서 포트폴리오를 생성하거나 선택하세요."
          />
        )}
      </div>
    </div>
  );
}
