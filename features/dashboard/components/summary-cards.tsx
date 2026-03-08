import { Card } from "@/components/ui/card";
import { cx } from "@/lib/utils";

type SummaryProps = {
  summary: {
    incompleteTodoCount: number;
    dueTodayCount: number;
    monthlyTradeCount: number;
    totalTodoCount: number;
  };
};

const cards = (summary: SummaryProps["summary"]) => [
  {
    label: "미완료 TODO",
    value: `${summary.incompleteTodoCount}`,
    description: "완료되지 않은 전체 할 일",
    insight:
      summary.incompleteTodoCount > 0
        ? "오늘 처리 순서를 정할 대상이 남아 있습니다."
        : "열린 TODO가 없습니다. 다음 계획을 작성할 수 있습니다.",
    accent: "from-[#214f39] via-[#1c6a49] to-[#2f845f]",
    text: "text-white",
    glow: "shadow-[0_20px_50px_rgba(24,63,43,0.22)]",
    progress:
      summary.totalTodoCount === 0
        ? 0
        : Math.round((summary.incompleteTodoCount / summary.totalTodoCount) * 100),
  },
  {
    label: "오늘 마감",
    value: `${summary.dueTodayCount}`,
    description: "한국 시간 기준 오늘 마감인 항목",
    insight:
      summary.dueTodayCount > 0
        ? "오늘 안에 확인할 마감 항목이 있습니다."
        : "당일 마감 압박은 없습니다.",
    accent: "from-[#a15518] via-[#c16b22] to-[#df8b37]",
    text: "text-white",
    glow: "shadow-[0_18px_44px_rgba(161,85,24,0.18)]",
    progress:
      summary.incompleteTodoCount === 0
        ? 0
        : Math.min(100, Math.round((summary.dueTodayCount / summary.incompleteTodoCount) * 100)),
  },
  {
    label: "이번 달 거래",
    value: `${summary.monthlyTradeCount}`,
    description: "이번 달 기록된 매매 횟수",
    insight:
      summary.monthlyTradeCount >= 5
        ? "활동 빈도가 높습니다. 회고 밀도를 함께 관리하세요."
        : "거래 기록은 차분한 수준입니다.",
    accent: "from-[#103a52] via-[#145678] to-[#2d7fa8]",
    text: "text-white",
    glow: "shadow-[0_18px_44px_rgba(16,58,82,0.16)]",
    progress: Math.min(100, summary.monthlyTradeCount * 20),
  },
  {
    label: "전체 TODO",
    value: `${summary.totalTodoCount}`,
    description: "기록된 할 일 총 개수",
    insight:
      summary.totalTodoCount >= 8
        ? "백로그가 커지고 있습니다. 묶거나 제거할 항목을 점검하세요."
        : "백로그 규모는 아직 관리 가능한 범위입니다.",
    accent: "from-[#232f52] via-[#1d2744] to-[#141d35]",
    text: "text-white",
    glow: "shadow-[0_18px_44px_rgba(10,15,30,0.24)]",
    progress: Math.min(100, summary.totalTodoCount * 10),
  },
];

export function SummaryCards({ summary }: Readonly<SummaryProps>) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards(summary).map((item) => (
        <Card
          key={item.label}
          className={cx(
            "relative overflow-hidden border border-[var(--border)] bg-gradient-to-br p-5",
            item.accent,
            item.text,
            item.glow,
          )}
        >
          <div className="absolute right-[-18px] top-[-18px] h-24 w-24 rounded-full bg-white/8 blur-2xl" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.24em] opacity-75">
            {item.label}
          </p>
          <p className="relative mt-4 text-4xl font-bold tracking-tight">
            {item.value}
          </p>
          <p className="relative mt-2 text-sm leading-6 opacity-85">
            {item.description}
          </p>
          <p className="relative mt-4 text-sm leading-6 opacity-90">
            {item.insight}
          </p>
          <div className="relative mt-6 h-1.5 rounded-full bg-black/20">
            <div
              className="h-full rounded-full bg-current/70"
              style={{ width: `${Math.max(12, item.progress)}%` }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
