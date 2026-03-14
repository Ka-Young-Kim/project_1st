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
    <Card surface="panel" className="overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Focus Queue
          </p>
          <h2 className="mt-2 text-xl font-semibold">다가오는 TODO</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            미완료 항목 중 마감이 가까운 순서대로 표시합니다.
          </p>
        </div>
        <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
          {items.length} items
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <EmptyState
            title="미완료 TODO가 없습니다"
            description="새 할 일을 추가하면 우선순위와 마감일 기준으로 이곳에 나타납니다."
          />
        ) : (
          items.map((item, index) => (
            <article
              key={item.id}
              className="group flex flex-col gap-3 rounded-[1rem] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-4 text-white transition hover:-translate-y-0.5 hover:border-[#6ea8fe]/35 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(110,168,254,0.16)] text-[13px] font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-[var(--muted)]">
                    마감일: {item.dueDate ? formatDateInput(item.dueDate) : "미지정"}
                  </p>
                </div>
              </div>
              <Badge tone={item.priority}>{item.priority}</Badge>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
