import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDisplayDate, formatTradeActionLabel } from "@/lib/utils";

type RecentTrade = {
  id: string;
  symbol: string;
  action: "buy" | "sell";
  tradeDate: Date;
  quantity: string;
  price: string;
  reason: string;
};

export function RecentTrades({ items }: Readonly<{ items: RecentTrade[] }>) {
  return (
    <Card surface="panel" className="overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Trade Tape
          </p>
          <h2 className="mt-2 text-xl font-semibold">최근 투자일지</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            최근 5개 거래 기록과 투자 이유를 확인합니다.
          </p>
        </div>
        <div className="rounded-full border border-[rgba(110,168,254,0.18)] bg-[rgba(110,168,254,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#d6e5ff]">
          {items.length} logs
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <EmptyState
            title="기록된 거래가 없습니다"
            description="첫 매수 또는 매도 기록을 남기면 이 영역에 최근 기록이 표시됩니다."
          />
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="rounded-[1rem] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-4 text-white transition hover:-translate-y-0.5 hover:border-[#8fb6ff]/25"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-white">
                      {item.symbol}
                    </h3>
                    <Badge tone={item.action}>{formatTradeActionLabel(item.action)}</Badge>
                  </div>
                  <p className="mt-1.5 text-[13px] text-[var(--muted)]">
                    {formatDisplayDate(item.tradeDate)} · {item.quantity}주 ·{" "}
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="rounded-[1rem] border border-white/10 bg-white/6 px-2.5 py-1.5 text-right text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7c93b7]">
                    Position
                  </p>
                  <p className="mt-1 text-sm font-semibold">{item.quantity}주</p>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-5 text-[#d8e4ff]">{item.reason}</p>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
