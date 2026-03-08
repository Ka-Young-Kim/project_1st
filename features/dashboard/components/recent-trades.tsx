import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDisplayDate } from "@/lib/utils";

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
    <Card className="overflow-hidden">
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
        <div className="rounded-full bg-[#e3eff7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#145678]">
          {items.length} logs
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <EmptyState
            title="기록된 거래가 없습니다"
            description="첫 매수 또는 매도 기록을 남기면 이 영역에 최근 기록이 표시됩니다."
          />
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.5rem] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,#f7f8fb,#eef3fa)] p-5 text-[#0f172a] transition hover:-translate-y-0.5 hover:border-[#145678]/25"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#0f172a]">
                      {item.symbol}
                    </h3>
                    <Badge tone={item.action}>{item.action}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[#64748b]">
                    {formatDisplayDate(item.tradeDate)} · {item.quantity}주 ·{" "}
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#d7deea] bg-white/95 px-3 py-2 text-right text-[#0f172a]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7c93b7]">
                    Position
                  </p>
                  <p className="mt-1 text-sm font-semibold">{item.quantity}주</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#334155]">{item.reason}</p>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
