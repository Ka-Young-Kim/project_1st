import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { InvestmentItemCategory } from "@/features/investment-items/lib/category";
import { JournalForm } from "@/features/journal/components/journal-form";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { JournalListItem } from "@/features/journal/types";
import {
  formatCurrency,
  formatDisplayDate,
  formatTradeActionLabel,
} from "@/lib/utils";

export function JournalList({
  entries,
  currentMonth,
  selectedDate,
  selectedEntryId,
  items,
  accounts,
  portfolioId,
  viewAllHref = "/journal",
}: Readonly<{
  entries: JournalListItem[];
  currentMonth: string;
  selectedDate?: string;
  selectedEntryId?: string;
  items: Array<{
    id: string;
    name: string;
    code: string;
    category: InvestmentItemCategory;
  }>;
  accounts: Array<{ id: string; name: string; bank: string; displayId: string }>;
  portfolioId: string;
  viewAllHref?: string;
}>) {
  function buildEntryHref(entryId: string) {
    const params = new URLSearchParams({ month: currentMonth, entry: entryId });

    if (portfolioId) {
      params.set("portfolio", portfolioId);
    }

    if (selectedDate) {
      params.set("date", selectedDate);
    }

    return `/journal?${params.toString()}`;
  }

  return (
    <Card className="min-w-0 text-white">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            List
          </p>
          <h2 className="mt-2 text-[1.15rem] font-semibold tracking-tight">
            거래 목록
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={viewAllHref}
            className="inline-flex h-9 items-center rounded-full border border-[rgba(110,168,254,0.28)] bg-[rgba(110,168,254,0.12)] px-3.5 text-[13px] font-semibold text-[#cfe1ff] transition hover:bg-[rgba(110,168,254,0.18)]"
          >
            전체 보기
          </Link>
          <SettingsDialog
            trigger={
              <button
                type="button"
                aria-label="새 투자일지 추가 열기"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#84adff]/35 bg-[#203764]/70 text-white transition hover:bg-[#274577]"
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
            <Card surface="dialog" className="p-5 sm:p-6">
              <JournalForm
                items={items}
                accounts={accounts}
                portfolioId={portfolioId}
                redirectMonth={currentMonth}
                redirectDate={selectedDate}
                embedded
              />
            </Card>
          </SettingsDialog>
        </div>
      </div>
      <div className="desktop-scroll-region space-y-3 overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <EmptyState
            title="투자일지가 없습니다"
            description="첫 거래 기록을 남기면 이 영역에서 바로 흐름을 확인할 수 있습니다."
          />
        ) : (
          entries.map((entry) => (
            <Link
              key={entry.id}
              href={buildEntryHref(entry.id)}
              className={`block rounded-[1.15rem] border px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,.18)] transition ${
                selectedEntryId === entry.id
                  ? "border-[#8fb6ff]/30 bg-[linear-gradient(180deg,rgba(36,56,96,.82),rgba(23,35,63,.9))]"
                  : "border-[var(--border)] bg-[linear-gradient(180deg,rgba(22,32,58,.96),rgba(20,29,53,.96))] hover:border-[#8fb6ff]/18"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[1.05rem] font-semibold leading-snug tracking-tight text-white">
                        {entry.itemName ?? entry.symbol}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-[#93a4c7]">
                        <span>{formatDisplayDate(entry.tradeDate)}</span>
                        {entry.portfolioAccountName ? <span>{entry.portfolioAccountName}</span> : null}
                        {entry.itemName ? <span>{entry.symbol}</span> : null}
                        <span>{entry.quantity}주</span>
                        <span>{formatCurrency(entry.price)}</span>
                      </div>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      <Badge tone={entry.action} compact>
                        {formatTradeActionLabel(entry.action)}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1.5">
                    <p className="truncate text-[12px] leading-5 text-[#8fb0ec]">
                      {entry.reason}
                    </p>
                    {entry.review ? (
                      <p className="truncate text-[12px] leading-5 text-white/50">
                        회고: {entry.review}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}
