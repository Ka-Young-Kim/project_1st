import { cx, formatWon } from "@/lib/utils";
import { HoldingDetailDialog } from "@/features/dashboard/components/holding-detail-dialog";

type HoldingItem = {
  symbol: string;
  averagePrice: string;
  currentPrice: string;
  quantity: string;
  profitRate: string;
  entries: Array<{
    id: string;
    tradeDate: string;
    action: "buy" | "sell";
    quantity: string;
    price: string;
    reason: string;
    review: string | null;
  }>;
};

type HoldingsListProps = {
  items: HoldingItem[];
};

export function HoldingsList({ items }: Readonly<HoldingsListProps>) {
  return (
    <section className="rounded-[18px] border border-[var(--border)] bg-white/3 p-4 md:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          Holdings
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          보유항목
        </h2>
      </div>

      <div className="mt-4 overflow-hidden rounded-[16px] border border-[var(--border)] bg-black/10">
        <div className="grid grid-cols-[1.2fr_.8fr_1fr_1fr_.8fr_32px] gap-3 border-b border-[var(--border)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          <span>항목</span>
          <span>갯수</span>
          <span>평단가</span>
          <span>현재가격</span>
          <span>이익률</span>
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

              return (
                <div
                  key={item.symbol}
                  className="grid grid-cols-[1.2fr_.8fr_1fr_1fr_.8fr_32px] items-center gap-3 border-b border-[var(--border)] px-4 py-3 text-sm last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--foreground)]">
                      {item.symbol}
                    </p>
                  </div>
                  <span className="text-[var(--foreground)]">{item.quantity}</span>
                  <span className="text-[var(--foreground)]">
                    {formatWon(item.averagePrice)}
                  </span>
                  <span className="text-[var(--foreground)]">
                    {formatWon(item.currentPrice)}
                  </span>
                  <span
                    className={cx(
                      "font-semibold",
                      profitValue > 0
                        ? "text-emerald-300"
                        : profitValue < 0
                          ? "text-rose-300"
                          : "text-[var(--muted)]",
                    )}
                  >
                    {profitLabel}
                  </span>
                  <div className="flex justify-end">
                    <HoldingDetailDialog
                      symbol={item.symbol}
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
