import { StatusToast } from "@/components/ui/status-toast";
import { InvestmentItemForm } from "@/features/investment-items/components/investment-item-form";
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
      <div className="flex flex-col gap-2">
        <p className="status-badge bg-white/80 text-[var(--accent-strong)]">
          Investment Items
        </p>
        <h1 className="text-3xl font-bold tracking-tight">투자 항목 관리</h1>
        <p className="text-sm text-[var(--muted)]">
          {activePortfolio
            ? `${activePortfolio.name} 포트폴리오 기준으로 투자 항목을 관리합니다.`
            : "포트폴리오를 먼저 생성하세요."}
        </p>
      </div>

      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}

      <div className="grid gap-6">
        <InvestmentItemList
          items={filteredItems}
          portfolioName={activePortfolio?.name}
          portfolioId={activePortfolio?.id}
          selectedCategory={selectedCategory}
        />
        {activePortfolio ? <InvestmentItemForm portfolioId={activePortfolio.id} /> : null}
      </div>
    </div>
  );
}
