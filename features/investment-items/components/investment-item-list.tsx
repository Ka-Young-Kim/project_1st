"use client";

import Link from "next/link";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
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
  selectedItemId,
}: Readonly<{
  items: InvestmentItemListEntry[];
  portfolioName?: string;
  portfolioId?: string;
  selectedCategory?: InvestmentItemCategory | "all";
  selectedItemId?: string;
}>) {
  const categoryTabs = [
    { value: "all", label: "전체" },
    ...INVESTMENT_ITEM_CATEGORIES,
  ] as const;
  const buildItemHref = (itemId: string) => {
    const params = new URLSearchParams();

    if (portfolioId) {
      params.set("portfolio", portfolioId);
    }

    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    params.set("item", itemId);

    return `/items?${params.toString()}`;
  };

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
          <p className="mt-2 text-[13px] leading-6 text-[#9fb4d8]">
            수동으로 등록한 종목과 계좌 유입 항목의 이름, 코드, 시세 메타데이터를 같은 화면에서 관리합니다.
          </p>
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
              <InvestmentItemForm
                portfolioId={portfolioId}
                embedded
                redirectCategory={selectedCategory ?? "all"}
              />
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
            <article key={item.id} className="group py-1.5">
              <div className="min-w-0">
                <InvestmentItemRow
                  category={item.category}
                  categoryLabel={item.categoryLabel}
                  industry={item.industry}
                  code={item.code}
                  name={item.name}
                  logCount={item.logCount}
                  isHolding={item.isHolding}
                  selectionHref={buildItemHref(item.id)}
                  isSelected={selectedItemId === item.id}
                />
              </div>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
