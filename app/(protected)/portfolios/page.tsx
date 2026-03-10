import { StatusToast } from "@/components/ui/status-toast";
import { PortfolioManagementBoard } from "@/features/portfolios/components/portfolio-management-board";
import { PortfolioForm } from "@/features/portfolios/components/portfolio-form";
import { PortfolioList } from "@/features/portfolios/components/portfolio-list";
import { getPortfolioManagement } from "@/features/portfolios/queries/get-portfolio-management";
import { getPortfolios } from "@/features/portfolios/queries/get-portfolios";
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
  const [{ activePortfolio }, portfolios] = await Promise.all([
    resolvePortfolioId(portfolioId),
    getPortfolios(),
  ]);
  const managementData = activePortfolio
    ? await getPortfolioManagement(activePortfolio.id)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="status-badge bg-white/80 text-[var(--accent-strong)]">
          Portfolios
        </p>
        <h1 className="text-3xl font-bold tracking-tight">포트폴리오 관리</h1>
        <p className="text-sm text-[var(--muted)]">
          계좌, 자산군, 목표 비율, 리밸런싱, 스냅샷을 한 화면에서 관리합니다.
        </p>
      </div>
      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}
      <div className="grid gap-6">
        {managementData ? <PortfolioManagementBoard data={managementData} /> : null}
        <PortfolioList portfolios={portfolios} />
        <PortfolioForm />
      </div>
    </div>
  );
}
