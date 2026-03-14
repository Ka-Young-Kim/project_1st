"use client";

import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { Badge } from "@/components/ui/badge";
import {
  formatDisplayDate,
  formatMoney,
  formatTradeActionLabel,
  formatWon,
} from "@/lib/utils";

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
  currency: string;
  usdToKrwRate: number | null;
  entries: HoldingEntry[];
};

export function HoldingDetailDialog({
  symbol,
  currency,
  usdToKrwRate,
  entries,
}: Readonly<HoldingDetailDialogProps>) {
  function getKrwConversion(value: string) {
    if (currency !== "USD" || !usdToKrwRate) {
      return null;
    }

    const krwValue = Number(value) * usdToKrwRate;

    if (!Number.isFinite(krwValue)) {
      return null;
    }

    return formatWon(String(krwValue));
  }

  return (
    <SettingsDialog
      trigger={
        <button
          type="button"
          aria-label={`${symbol} 자세히 보기`}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-white/4 text-[#9fb0d3] transition hover:bg-white/8 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 4.75h5.5L18.25 9.5V18A2.25 2.25 0 0 1 16 20.25H8A2.25 2.25 0 0 1 5.75 18V7A2.25 2.25 0 0 1 8 4.75Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M13.25 4.75V9.5H18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M8.75 12.25h6.5M8.75 15.25h4.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
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
              entries.map((entry) => {
                const priceKrw = getKrwConversion(entry.price);

                return (
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
                          <div>
                            <p>{formatMoney(entry.price, currency)}</p>
                            {priceKrw ? (
                              <p className="mt-1 text-[11px] text-white/50">
                                {priceKrw}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <Badge tone={entry.action} compact>
                        {formatTradeActionLabel(entry.action)}
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
                );
              })
            )}
          </div>
        </div>
      </section>
    </SettingsDialog>
  );
}
