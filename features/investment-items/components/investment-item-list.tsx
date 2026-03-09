import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { deleteInvestmentItemAction } from "@/features/investment-items/actions/delete-investment-item";
import { updateInvestmentItemAction } from "@/features/investment-items/actions/update-investment-item";
import { InvestmentItemFields } from "@/features/investment-items/components/investment-item-fields";
import { InvestmentItemRow } from "@/features/investment-items/components/investment-item-row";
import {
  INVESTMENT_ITEM_CATEGORIES,
  InvestmentItemCategory,
} from "@/features/investment-items/lib/category";
import { cx } from "@/lib/utils";

type InvestmentItemListEntry = {
  id: string;
  portfolioId: string | null;
  name: string;
  code: string;
  quoteSymbol: string | null;
  exchange: string | null;
  currency: string | null;
  category: InvestmentItemCategory;
  categoryLabel: string;
  industry: string | null;
  active: boolean;
  logCount: number;
  isHolding: boolean;
  updatedAt: Date;
};

export function InvestmentItemList({
  items,
  portfolioName,
  portfolioId,
  selectedCategory,
}: Readonly<{
  items: InvestmentItemListEntry[];
  portfolioName?: string;
  portfolioId?: string;
  selectedCategory?: InvestmentItemCategory | "all";
}>) {
  const fieldClassName =
    "appearance-none border-white/12 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";
  const selectFieldClassName =
    `${fieldClassName} [&>option]:bg-[#15203a] [&>option]:text-white`;
  const categoryTabs = [
    { value: "all", label: "전체" },
    ...INVESTMENT_ITEM_CATEGORIES,
  ] as const;

  return (
    <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            Items
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            투자 항목 목록
          </h2>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {categoryTabs.map((tab) => {
          const params = new URLSearchParams();

          if (portfolioId) {
            params.set("portfolio", portfolioId);
          }

          if (tab.value !== "all") {
            params.set("category", tab.value);
          }

          const href = params.size > 0 ? `/items?${params.toString()}` : "/items";
          const isActive = (selectedCategory ?? "all") === tab.value;

          return (
            <Link
              key={tab.value}
              href={href}
              className={cx(
                "rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.08em] transition",
                isActive
                  ? "border-[#8fb6ff]/55 bg-[#203764] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  : "border-white/10 bg-white/4 text-[#93a4c7] hover:bg-white/8 hover:text-white",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-5 max-h-[23rem] overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="[&_h3]:text-white [&_p]:text-[#c4d4f2]">
            <EmptyState
              title="등록된 투자 항목이 없습니다"
              description={
                portfolioName
                  ? `${portfolioName} 포트폴리오에 첫 항목을 추가하면 투자일지와 대시보드에서 함께 사용합니다.`
                  : "아래에서 첫 항목을 추가하면 투자일지와 대시보드에서 함께 사용합니다."
              }
            />
          </div>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="group py-1.5"
            >
              <div className="min-w-0">
                <InvestmentItemRow
                  categoryLabel={item.categoryLabel}
                  industry={item.industry}
                  code={item.code}
                  name={item.name}
                  logCount={item.logCount}
                  isHolding={item.isHolding}
                >
                        <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] p-5 text-white shadow-[0_14px_40px_rgba(0,0,0,.28)] sm:p-6">
                          <div className="pr-14">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
                              Investment Item
                            </p>
                            <h3 className="mt-3 text-2xl font-semibold">
                              {item.name}
                            </h3>
                          </div>

                          <form action={updateInvestmentItemAction} className="mt-6 space-y-4">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="portfolioId" value={item.portfolioId ?? ""} />

                            <InvestmentItemFields
                              codePlaceholder="005930 또는 AAPL"
                              defaultName={item.name}
                              defaultCode={item.code}
                              defaultCategory={item.category}
                              defaultIndustry={item.industry}
                              fieldClassName={fieldClassName}
                              selectFieldClassName={selectFieldClassName}
                            />

                            <div className="grid gap-4 md:grid-cols-3">
                              <label className="space-y-1.5">
                                <span className="text-sm font-medium">시세 심볼</span>
                                <Input
                                  name="quoteSymbol"
                                  defaultValue={item.quoteSymbol ?? ""}
                                  placeholder="005930 또는 AAPL"
                                  className={`${fieldClassName} py-2.5`}
                                />
                              </label>
                              <label className="space-y-1.5">
                                <span className="text-sm font-medium">거래소</span>
                                <Input
                                  name="exchange"
                                  defaultValue={item.exchange ?? ""}
                                  placeholder="KRX, NASDAQ"
                                  className={`${fieldClassName} py-2.5`}
                                />
                              </label>
                              <label className="space-y-1.5">
                                <span className="text-sm font-medium">통화</span>
                                <Input
                                  name="currency"
                                  defaultValue={item.currency ?? ""}
                                  placeholder="KRW, USD"
                                  className={`${fieldClassName} py-2.5`}
                                />
                              </label>
                            </div>

                            <p className="rounded-[1rem] border border-white/8 bg-black/10 px-4 py-3 text-xs leading-5 text-[#93a4c7]">
                              기본값은 코드 기반 자동 설정입니다. 6자리 한국 종목 코드는 `KRX / KRW`로 자동 처리되며, 이 값들은 예외 케이스에서만 수정하는 것을 권장합니다.
                            </p>
                            <SubmitButton className="w-full" pendingLabel="수정 저장 중...">
                              수정 저장
                            </SubmitButton>
                          </form>

                          <form action={deleteInvestmentItemAction} className="mt-3">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="portfolioId" value={item.portfolioId ?? ""} />
                            <ConfirmSubmitButton
                              confirmMessage="이 투자 항목을 삭제하시겠습니까? 연결된 투자일지가 있으면 삭제되지 않습니다."
                              className="w-full rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                            >
                              삭제
                            </ConfirmSubmitButton>
                          </form>
                        </Card>
                </InvestmentItemRow>
              </div>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
