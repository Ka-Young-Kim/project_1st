import { StatusToast } from "@/components/ui/status-toast";
import { InvestmentItemForm } from "@/features/investment-items/components/investment-item-form";
import { InvestmentItemList } from "@/features/investment-items/components/investment-item-list";
import { getInvestmentItems } from "@/features/investment-items/queries/get-investment-items";
import { getStatusMessage } from "@/lib/constants";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function InvestmentItemsPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusParam = Array.isArray(searchParams.status)
    ? searchParams.status[0]
    : searchParams.status;
  const banner = getStatusMessage(statusParam);
  const items = await getInvestmentItems();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="status-badge bg-white/80 text-[var(--accent-strong)]">
          Investment Items
        </p>
        <h1 className="text-3xl font-bold tracking-tight">투자 항목 관리</h1>
        <p className="text-sm text-[var(--muted)]">
          투자 항목 마스터를 먼저 정리하고, 투자일지에서는 선택해서 연결합니다.
        </p>
      </div>

      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}

      <div className="grid gap-6">
        <InvestmentItemList items={items} />
        <InvestmentItemForm />
      </div>
    </div>
  );
}
