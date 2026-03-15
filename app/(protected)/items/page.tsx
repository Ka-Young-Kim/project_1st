import { DesktopSplitLayout } from "@/components/layout/desktop-split-layout";
import { StatusToast } from "@/components/ui/status-toast";
import { InvestmentItemInspector } from "@/features/investment-items/components/investment-item-inspector";
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
  const selectedItemId = Array.isArray(searchParams.item)
    ? searchParams.item[0]
    : searchParams.item;
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
  const selectedItem =
    filteredItems.find((item) => item.id === selectedItemId) ??
    items.find((item) => item.id === selectedItemId);

  return (
    <div className="space-y-6">
      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}

      <DesktopSplitLayout
        className="xl:grid-cols-[minmax(0,1fr)_340px]"
        primary={
          <InvestmentItemList
            items={filteredItems}
            portfolioName={activePortfolio?.name}
            portfolioId={activePortfolio?.id}
            selectedCategory={selectedCategory}
            selectedItemId={selectedItem?.id}
          />
        }
        secondary={
          <InvestmentItemInspector
            item={selectedItem}
            portfolioName={activePortfolio?.name}
            selectedCategory={selectedCategory}
          />
        }
      />
    </div>
  );
}
