import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateInput } from "@/lib/utils";

type UpcomingTodo = {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  dueDate: Date | null;
};

export function UpcomingTodos({ items }: Readonly<{ items: UpcomingTodo[] }>) {
  return (
    <Card>
      <div>
        <h2 className="text-xl font-semibold">다가오는 TODO</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          미완료 항목 중 마감이 가까운 순서대로 표시합니다.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <EmptyState
            title="미완료 TODO가 없습니다"
            description="새 할 일을 추가하면 우선순위와 마감일 기준으로 이곳에 나타납니다."
          />
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-3 rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  마감일: {item.dueDate ? formatDateInput(item.dueDate) : "미지정"}
                </p>
              </div>
              <Badge tone={item.priority}>{item.priority}</Badge>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
