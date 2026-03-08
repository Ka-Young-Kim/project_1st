import { Card } from "@/components/ui/card";

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
  },
  {
    label: "오늘 마감",
    value: `${summary.dueTodayCount}`,
    description: "한국 시간 기준 오늘 마감인 항목",
  },
  {
    label: "이번 달 거래",
    value: `${summary.monthlyTradeCount}`,
    description: "이번 달 기록된 매매 횟수",
  },
  {
    label: "전체 TODO",
    value: `${summary.totalTodoCount}`,
    description: "기록된 할 일 총 개수",
  },
];

export function SummaryCards({ summary }: Readonly<SummaryProps>) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards(summary).map((item) => (
        <Card key={item.label} className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            {item.label}
          </p>
          <p className="mt-4 text-4xl font-bold tracking-tight">{item.value}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {item.description}
          </p>
        </Card>
      ))}
    </div>
  );
}
