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
    <div className="grid gap-4 md:grid-cols-3">
      {cards(summary).map((item) => (
        <Card
          key={item.label}
          className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            {item.label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {item.value}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#93a4c7]">{item.description}</p>
        </Card>
      ))}
    </div>
  );
}
