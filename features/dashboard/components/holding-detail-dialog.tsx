"use client";

import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { Badge } from "@/components/ui/badge";
import { formatDisplayDate, formatWon } from "@/lib/utils";

type HoldingEntry = {
  id: string;
  tradeDate: string;
  action: "buy" | "sell";
  quantity: string;
  price: string;
  reason: string;
  review: string | null;
};

type HoldingDetailDialogProps = {
  symbol: string;
  entries: HoldingEntry[];
};

export function HoldingDetailDialog({
  symbol,
  entries,
}: Readonly<HoldingDetailDialogProps>) {
  return (
    <SettingsDialog
      trigger={
        <button
          type="button"
          aria-label={`${symbol} 자세히 보기`}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-white/4 text-xs text-[#9fb0d3] transition hover:bg-white/8 hover:text-white"
        >
          +
        </button>
      }
    >
      <section className="glass-panel rounded-[22px] p-5 text-white shadow-[0_14px_40px_rgba(0,0,0,.28)] sm:p-6">
        <div className="pr-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            Holding Journal
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">{symbol}</h3>
          <p className="mt-2 text-sm leading-6 text-[#93a4c7]">
            투자일지 기반 항목별 거래 기록입니다.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-[18px] border border-white/8 bg-black/10">
          <div className="border-b border-white/8 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#93a4c7]">
            Journal Entries
          </div>
          <div className="max-h-[37rem] space-y-3 overflow-y-auto p-4">
            {entries.length === 0 ? (
              <p className="text-sm text-[#93a4c7]">해당 항목의 기록이 없습니다.</p>
            ) : (
              entries.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-[16px] border border-white/8 bg-white/4 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {formatDisplayDate(new Date(entry.tradeDate))}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#93a4c7]">
                        <span>{entry.quantity}주</span>
                        <span>{formatWon(entry.price)}</span>
                      </div>
                    </div>
                    <Badge tone={entry.action} compact>
                      {entry.action}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#dbe7ff]">
                    {entry.reason}
                  </p>
                  {entry.review ? (
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      회고: {entry.review}
                    </p>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </SettingsDialog>
  );
}
