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
    <Card>
      <div>
        <h2 className="text-xl font-semibold">최근 투자일지</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          최근 5개 거래 기록과 투자 이유를 확인합니다.
        </p>
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
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{item.symbol}</h3>
                <Badge tone={item.action}>{item.action}</Badge>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {formatDisplayDate(item.tradeDate)} · {item.quantity}주 ·{" "}
                {formatCurrency(item.price)}
              </p>
              <p className="mt-4 text-sm leading-6">{item.reason}</p>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
