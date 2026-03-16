import { StatusToast } from "@/components/ui/status-toast";
import { EmptyState } from "@/components/ui/empty-state";
import { PortfolioAccountManagement } from "@/features/portfolios/components/portfolio-account-management";
import { getPortfolioManagement } from "@/features/portfolios/queries/get-portfolio-management";
import { resolvePortfolioId } from "@/features/portfolios/queries/get-portfolios";
import { getStatusMessage } from "@/lib/constants";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AccountsPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusParam = Array.isArray(searchParams.status)
    ? searchParams.status[0]
    : searchParams.status;
  const portfolioId = Array.isArray(searchParams.portfolio)
    ? searchParams.portfolio[0]
    : searchParams.portfolio;
  const selectedAccountId = Array.isArray(searchParams.account)
    ? searchParams.account[0]
    : searchParams.account;
  const banner = getStatusMessage(statusParam);
  const { activePortfolio } = await resolvePortfolioId(portfolioId);
  const managementData = activePortfolio
    ? await getPortfolioManagement(activePortfolio.id)
    : null;
  const realAccounts =
    managementData?.accounts.filter((account) => !account.id.startsWith("__")) ?? [];

  return (
    <div className="space-y-6">
      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}
      {managementData ? (
        <PortfolioAccountManagement
          portfolioId={managementData.portfolio.id}
          accounts={realAccounts}
          selectedAccountId={selectedAccountId}
        />
      ) : (
        <EmptyState
          title="선택된 포트폴리오가 없습니다"
          description="상단 아이콘 페이지에서 포트폴리오를 생성하거나 선택하세요."
        />
      )}
    </div>
  );
}
