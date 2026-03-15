import { Card } from "@/components/ui/card";

type TodoStatsProps = {
  summary: {
    monthLabel: string;
    registeredTodoCount: number;
    completedTodoCount: number;
    remainingTodoCount: number;
  };
};

const cards = (summary: TodoStatsProps["summary"]) => [
  {
    label: "등록한 일정",
    value: `${summary.registeredTodoCount}`,
    description: "선택한 월 기준 등록된 일정",
  },
  {
    label: "완료된 일정",
    value: `${summary.completedTodoCount}`,
    description: "선택한 월 기준 완료 처리된 일정",
  },
  {
    label: "남은 일정",
    value: `${summary.remainingTodoCount}`,
    description: "선택한 월 기준 아직 남아 있는 일정",
  },
] as const;

export function TodoStats({ summary }: Readonly<TodoStatsProps>) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
        {cards(summary).map((item) => (
          <Card
            key={item.label}
            surface="metric"
            className="flex min-h-[7.75rem] flex-col rounded-[16px] p-3.5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
              {item.label}
            </p>
            <p className="mt-2 flex-1 text-[1.45rem] font-semibold tracking-tight text-white">
              {item.value}
            </p>
            <p className="text-[13px] text-[#93a4c7]">{item.description}</p>
          </Card>
        ))}
    </div>
  );
}
