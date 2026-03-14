import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { PortfolioManagementData } from "@/features/portfolios/services/portfolio-management-service";
import { formatDisplayDate, formatWon } from "@/lib/utils";

function formatPercent(value: number) {
  return `${value.toFixed(1).replace(/\.0$/, "")}%`;
}

function ProfitTone({
  value,
}: Readonly<{
  value: number;
}>) {
  return (
    <span className={value >= 0 ? "text-[#ff8e8e]" : "text-[#8fb6ff]"}>
      {formatPercent(value)}
    </span>
  );
}

export function PortfolioSnapshotHistory({
  snapshots,
  className,
}: Readonly<{
  snapshots: PortfolioManagementData["snapshots"];
  className?: string;
}>) {
  return (
    <Card
      surface="glass"
      className={`bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)] ${className ?? ""}`.trim()}
    >
      <h3 className="text-2xl font-semibold tracking-tight">스냅샷 히스토리</h3>

      <div className="mt-5 space-y-3">
        {snapshots.length === 0 ? (
          <EmptyState
            title="아직 스냅샷이 없습니다"
            description="상단 버튼으로 오늘 포트폴리오 상태를 기록하세요."
          />
        ) : (
          snapshots.map((snapshot) => (
            <article
              key={snapshot.id}
              className="rounded-[1.2rem] border border-[var(--border)] bg-white/4 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {formatDisplayDate(snapshot.snapshotDate)}
                  </p>
                  <p className="mt-1 text-xs text-[#93a4c7]">
                    계좌 {snapshot.accountCount}개, 자산군 {snapshot.assetGroupCount}개
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#93a4c7]">
                    평가금 {formatWon(String(snapshot.marketValue))}
                  </p>
                  <p className="mt-1 text-sm">
                    <ProfitTone value={snapshot.profitRate} />
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
