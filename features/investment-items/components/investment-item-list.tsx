"use client";

import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteInvestmentItemAction } from "@/features/investment-items/actions/delete-investment-item";
import { updateInvestmentItemAction } from "@/features/investment-items/actions/update-investment-item";
import { InvestmentItemFields } from "@/features/investment-items/components/investment-item-fields";
import { InvestmentItemForm } from "@/features/investment-items/components/investment-item-form";
import { InvestmentItemRow } from "@/features/investment-items/components/investment-item-row";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
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
          <h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight">
            상세 항목
          </h2>
        </div>
        {portfolioId ? (
          <SettingsDialog
            trigger={
              <button
                type="button"
                aria-label="투자 항목 추가 열기"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#84adff]/35 bg-[#203764]/70 text-white transition hover:bg-[#274577]"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 4.5v11M4.5 10h11"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            }
          >
            <Card className="rounded-[18px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] p-4 text-white shadow-[0_12px_30px_rgba(0,0,0,.24)] sm:p-5">
              <InvestmentItemForm portfolioId={portfolioId} embedded />
            </Card>
          </SettingsDialog>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
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
                "rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] transition",
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

      <div className="mt-4 max-h-[22rem] overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="[&_h3]:text-white [&_p]:text-[#c4d4f2]">
            <EmptyState
              title="등록된 투자 항목이 없습니다"
              description={
                portfolioName
                  ? `${portfolioName} 포트폴리오에서 관리할 첫 항목을 추가하면 투자일지와 대시보드에서 함께 사용합니다.`
                  : "공통으로 사용할 첫 항목을 추가하면 투자일지와 대시보드에서 함께 사용합니다."
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
                  category={item.category}
                  categoryLabel={item.categoryLabel}
                  industry={item.industry}
                  code={item.code}
                  name={item.name}
                  logCount={item.logCount}
                  isHolding={item.isHolding}
                >
                        <Card className="rounded-[18px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] p-4 text-white shadow-[0_12px_30px_rgba(0,0,0,.24)] sm:p-5">
                          <div className="pr-14">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
                              Investment Item
                            </p>
                            <h3 className="mt-2.5 text-[1.3rem] font-semibold">
                              {item.name}
                            </h3>
                          </div>

                          <form
                            id={`investment-item-update-${item.id}`}
                            action={updateInvestmentItemAction}
                            className="mt-4 space-y-3.5"
                          >
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="portfolioId" value={item.portfolioId ?? ""} />

                            <InvestmentItemFields
                              codePlaceholder="005930 또는 AAPL"
                              categoryLocked
                              defaultName={item.name}
                              defaultCode={item.code}
                              defaultCategory={item.category}
                              defaultIndustry={item.industry}
                              defaultQuoteSymbol={item.quoteSymbol ?? ""}
                              defaultExchange={item.exchange ?? ""}
                              defaultCurrency={item.currency ?? ""}
                              fieldClassName={fieldClassName}
                              selectFieldClassName={selectFieldClassName}
                            />
                          </form>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button
                              type="submit"
                              form={`investment-item-update-${item.id}`}
                              className="inline-flex min-h-10 w-full items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,#76aefd,#5a8ee6)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(90,142,230,0.22)] transition hover:bg-[linear-gradient(180deg,#86b8ff,#6798ea)]"
                            >
                              수정 저장
                            </button>

                            <form action={deleteInvestmentItemAction}>
                              <input type="hidden" name="id" value={item.id} />
                              <input type="hidden" name="portfolioId" value={item.portfolioId ?? ""} />
                              <ConfirmSubmitButton
                                confirmMessage="이 투자 항목을 삭제하시겠습니까? 연결된 투자일지가 있으면 삭제되지 않습니다."
                                className="w-full rounded-[1rem] border border-rose-300/30 bg-rose-400/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                              >
                                삭제
                              </ConfirmSubmitButton>
                            </form>
                          </div>
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
