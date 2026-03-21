import { EmptyState } from "@/components/ui/empty-state";
import { PortfolioManagementBoard } from "@/features/portfolios/components/portfolio-management-board";
import { getPortfolioManagement } from "@/features/portfolios/queries/get-portfolio-management";
import { resolvePortfolioId } from "@/features/portfolios/queries/get-portfolios";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PortfolioWorkspacePage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const portfolioId = Array.isArray(searchParams.portfolio)
    ? searchParams.portfolio[0]
    : searchParams.portfolio;
  const { activePortfolio } = await resolvePortfolioId(portfolioId);
  const managementData = activePortfolio
    ? await getPortfolioManagement(activePortfolio.id)
    : null;

  return (
    <div className="space-y-6">
      {managementData ? (
        <PortfolioManagementBoard data={managementData} />
      ) : (
        <EmptyState
          title="선택된 포트폴리오가 없습니다"
          description="포트폴리오 허브에서 포트폴리오를 생성하거나 선택하세요."
        />
      )}
    </div>
  );
}
