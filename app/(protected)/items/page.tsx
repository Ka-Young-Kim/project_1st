import { StatusToast } from "@/components/ui/status-toast";
import { PageHeader } from "@/components/ui/page-header";
import { InvestmentItemList } from "@/features/investment-items/components/investment-item-list";
import { normalizeInvestmentItemCategory } from "@/features/investment-items/lib/category";
import { getInvestmentItems } from "@/features/investment-items/queries/get-investment-items";
import { resolvePortfolioId } from "@/features/portfolios/queries/get-portfolios";
import { getStatusMessage } from "@/lib/constants";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function InvestmentItemsPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusParam = Array.isArray(searchParams.status)
    ? searchParams.status[0]
    : searchParams.status;
  const portfolioId = Array.isArray(searchParams.portfolio)
    ? searchParams.portfolio[0]
    : searchParams.portfolio;
  const categoryParam = Array.isArray(searchParams.category)
    ? searchParams.category[0]
    : searchParams.category;
  const banner = getStatusMessage(statusParam);
  const { activePortfolio } = await resolvePortfolioId(portfolioId);
  const items = await getInvestmentItems({
    portfolioId: activePortfolio?.id,
  });
  const selectedCategory =
    categoryParam === "all" || !categoryParam
      ? "all"
      : normalizeInvestmentItemCategory(categoryParam);
  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Investment Items"
        title="투자 항목 관리"
        description={
          activePortfolio
            ? `${activePortfolio.name} 포트폴리오 기준으로 종목 정보를 정리하고, 거래 기록과 시세 조회에 사용할 기본 메타데이터를 관리합니다.`
            : "포트폴리오를 먼저 생성한 뒤 투자 항목을 등록하세요."
        }
      />

      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}

      <div className="grid gap-5">
        <InvestmentItemList
          items={filteredItems}
          portfolioName={activePortfolio?.name}
          portfolioId={activePortfolio?.id}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
}
