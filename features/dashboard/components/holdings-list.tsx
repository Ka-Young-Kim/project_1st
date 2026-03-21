import { cx, formatDisplayDate, formatMoney, formatWon } from "@/lib/utils";
import { HoldingDetailDialog } from "@/features/dashboard/components/holding-detail-dialog";
import type { PortfolioHoldingSummary } from "@/features/portfolios/lib/holdings";

type HoldingsListProps = {
  items: PortfolioHoldingSummary[];
};

export function HoldingsList({ items }: Readonly<HoldingsListProps>) {
  const usdToKrwRate =
    items.find((item) => item.usdToKrwRate)?.usdToKrwRate ?? null;

  function getKrwConversion(
    value: string,
    currency: string,
    usdToKrwRate: number | null,
  ) {
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
    <section className="rounded-[var(--card-radius)] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(14,22,42,.98))] p-4 shadow-[0_14px_36px_rgba(2,8,23,.24)] md:p-5">
      <div className="flex items-end justify-between gap-3 border-b border-white/6 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Holdings
          </p>
          <h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight">
            보유항목
          </h2>
          <p className="mt-1.5 text-[13px] leading-5 text-[var(--muted)]">
            보유 종목의 수량, 평단가, 현재가, 수익률을 한 행에서 읽을 수 있게
            정리했습니다.
          </p>
        </div>
        {usdToKrwRate ? (
          <p className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[10px] font-medium text-[var(--muted)]">
            1달러 = {formatWon(String(usdToKrwRate))}
          </p>
        ) : null}
      </div>

      <div className="mt-4 overflow-hidden rounded-[1rem] border border-[var(--border)] bg-[rgba(5,10,22,0.36)]">
        <div className="grid grid-cols-[1.35fr_.7fr_1fr_1fr_.8fr_36px] gap-3 border-b border-[var(--border)] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          <span>항목</span>
          <span className="text-center">보유수량</span>
          <span className="text-right">평단가</span>
          <span className="text-right">현재가격</span>
          <span className="text-right">이익률</span>
          <span />
        </div>

        <div className="max-h-[29.5rem] overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-sm text-[var(--muted)]">
              표시할 보유항목이 없습니다.
            </div>
          ) : (
            items.map((item) => {
              const profitValue = Number(item.profitRate);
              const profitLabel =
                profitValue > 0
                  ? `+${item.profitRate}%`
                  : `${item.profitRate}%`;
              const averagePriceKrw = getKrwConversion(
                item.averagePrice,
                item.currency,
                item.usdToKrwRate,
              );
              const currentPriceKrw = getKrwConversion(
                item.currentPrice,
                item.currency,
                item.usdToKrwRate,
              );

              return (
                <div
                  key={item.code}
                  className="grid grid-cols-[1.35fr_.7fr_1fr_1fr_.8fr_36px] items-center gap-3 border-b border-[var(--border)] px-4 py-3 text-[13px] transition hover:bg-white/4 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--foreground)]">
                      {item.name}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-[var(--muted)]">
                      {item.code}
                      {item.priceSource === "live"
                        ? " · live"
                        : item.priceSource === "delayed"
                          ? " · delayed"
                          : " · last trade"}
                      {item.priceUpdatedAt
                        ? ` · ${formatDisplayDate(new Date(item.priceUpdatedAt))}`
                        : ""}
                    </p>
                  </div>
                  <span className="text-center text-[var(--foreground)]">
                    {item.quantity}
                  </span>
                  <div className="text-right">
                    <p className="text-[var(--foreground)]">
                      {formatMoney(item.averagePrice, item.currency)}
                    </p>
                    {averagePriceKrw ? (
                      <p className="mt-1 text-[11px] text-[var(--muted)]">
                        {averagePriceKrw}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--foreground)]">
                      {formatMoney(item.currentPrice, item.currency)}
                    </p>
                    {currentPriceKrw ? (
                      <p className="mt-1 text-[11px] text-[var(--muted)]">
                        {currentPriceKrw}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={cx(
                      "block text-right font-semibold",
                      profitValue > 0
                        ? "text-[#ff8e8e]"
                        : profitValue < 0
                          ? "text-[#8fb6ff]"
                          : "text-[var(--muted)]",
                    )}
                  >
                    {profitLabel}
                  </span>
                  <div className="flex justify-end">
                    <HoldingDetailDialog
                      symbol={item.name}
                      currency={item.currency}
                      usdToKrwRate={item.usdToKrwRate}
                      entries={item.entries}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
