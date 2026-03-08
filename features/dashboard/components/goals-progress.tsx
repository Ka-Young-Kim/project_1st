import { Card } from "@/components/ui/card";

type GoalsProgressProps = {
  completionRate: number;
  monthlyTradeCount: number;
  cashReadiness: number;
};

const goals = (props: GoalsProgressProps) => [
  {
    label: "주간 실행률",
    value: `${props.completionRate}%`,
    width: Math.min(100, props.completionRate),
    subtext: "미완료 TODO를 얼마나 정리했는지 보여줍니다.",
  },
  {
    label: "월간 기록 밀도",
    value: `${Math.min(100, props.monthlyTradeCount * 20)}%`,
    width: Math.min(100, props.monthlyTradeCount * 20),
    subtext: "거래 빈도와 회고 기록 리듬을 함께 봅니다.",
  },
  {
    label: "대응 여력",
    value: `${props.cashReadiness}%`,
    width: Math.min(100, props.cashReadiness),
    subtext: "오늘 마감 압박이 적을수록 여유가 높다고 봅니다.",
  },
];

export function GoalsProgress(props: Readonly<GoalsProgressProps>) {
  return (
    <Card className="rounded-[22px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">목표 진행률</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            핵심 운영 지표를 퍼센트로 추적합니다.
          </p>
        </div>
        <span className="inline-flex h-8 items-center rounded-full border border-[rgba(110,168,254,0.22)] bg-[rgba(110,168,254,0.12)] px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#cfe1ff]">
          Goals
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {goals(props).map((goal) => (
          <div key={goal.label}>
            <div className="flex items-center justify-between gap-3 text-sm font-semibold">
              <span>{goal.label}</span>
              <span>{goal.value}</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full border border-[var(--border)] bg-[#0c1325]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#6ea8fe,#7cf2c9)]"
                style={{ width: `${Math.max(8, goal.width)}%` }}
              />
            </div>
            <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
              {goal.subtext}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
