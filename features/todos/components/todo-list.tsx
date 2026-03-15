import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { toggleTodoAction } from "@/features/todos/actions/toggle-todo";
import { TodoForm } from "@/features/todos/components/todo-form";
import { TodoListItem } from "@/features/todos/types";
import { formatDateInput, getTodayDateInputInSeoul } from "@/lib/utils";

export function TodoList({
  todos,
  currentMonth,
  selectedDate,
  selectedTodoId,
  viewAllHref = "/todos",
}: Readonly<{
  todos: TodoListItem[];
  currentMonth: string;
  selectedDate?: string;
  selectedTodoId?: string;
  viewAllHref?: string;
}>) {
  const today = getTodayDateInputInSeoul();

  function buildTodoHref(todoId: string) {
    const params = new URLSearchParams({ month: currentMonth, todo: todoId });

    if (selectedDate) {
      params.set("date", selectedDate);
    }

    return `/todos?${params.toString()}`;
  }

  return (
    <Card className="min-w-0 text-white">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            List
          </p>
          <h2 className="mt-2 text-[1.15rem] font-semibold tracking-tight">
            일정 목록
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={viewAllHref}
            className="inline-flex h-9 items-center rounded-full border border-[rgba(110,168,254,0.28)] bg-[rgba(110,168,254,0.12)] px-3.5 text-[13px] font-semibold text-[#cfe1ff] transition hover:bg-[rgba(110,168,254,0.18)]"
          >
            전체 보기
          </Link>
          <SettingsDialog
            trigger={
              <button
                type="button"
                aria-label="새 TODO 추가 열기"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#84adff]/35 bg-[#203764]/70 text-white transition hover:bg-[#274577]"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 4.5v11M4.5 10h11"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            }
          >
            <Card surface="dialog" className="p-5 sm:p-6">
              <TodoForm
                embedded
                redirectMonth={currentMonth}
                redirectDate={selectedDate}
              />
            </Card>
          </SettingsDialog>
        </div>
      </div>

      <div className="desktop-scroll-region space-y-3 overflow-y-auto pr-1">
        {todos.length === 0 ? (
          <EmptyState
            title="등록된 TODO가 없습니다"
            description="새 TODO를 추가하면 이 영역에서 바로 확인할 수 있습니다."
          />
        ) : (
          todos.map((todo) => {
            const dueDateInput = todo.dueDate ? formatDateInput(todo.dueDate) : null;
            const isOverdue = Boolean(
              dueDateInput && dueDateInput < today && !todo.completed,
            );
            const hasNotes = Boolean(todo.notes?.trim());

            return (
              <article
                key={todo.id}
                className={`rounded-[1.15rem] border px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,.18)] transition ${
                  selectedTodoId === todo.id
                    ? "border-[#8fb6ff]/30 bg-[linear-gradient(180deg,rgba(36,56,96,.82),rgba(23,35,63,.9))]"
                    : "border-[var(--border)] bg-[linear-gradient(180deg,rgba(22,32,58,.96),rgba(20,29,53,.96))] hover:border-[#8fb6ff]/18"
                }`}
              >
                <div className="flex items-start gap-3">
                  <form action={toggleTodoAction} className="pt-1">
                    <input type="hidden" name="id" value={todo.id} />
                    <input
                      type="hidden"
                      name="completed"
                      value={todo.completed ? "false" : "true"}
                    />
                    <input type="hidden" name="redirectMonth" value={currentMonth} />
                    <input type="hidden" name="redirectDate" value={selectedDate ?? ""} />
                    <input type="hidden" name="redirectTodo" value={todo.id} />
                    <button
                      type="submit"
                      aria-label={todo.completed ? "TODO 다시 열기" : "TODO 완료 처리"}
                      className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-[0.25rem] border text-[9px] font-bold transition ${
                        todo.completed
                          ? "border-[#6ea8fe] bg-[#6ea8fe] text-[#08111f]"
                          : "border-white/35 bg-white text-[#0b1020] hover:border-white/60"
                      }`}
                    >
                      {todo.completed ? "✓" : ""}
                    </button>
                  </form>

                  <Link
                    href={buildTodoHref(todo.id)}
                    className="min-w-0 flex-1 rounded-[0.85rem] outline-none focus-visible:ring-2 focus-visible:ring-[#6ea8fe]/30 focus-visible:ring-inset"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[1rem] font-semibold leading-snug tracking-tight ${
                            todo.completed ? "text-white/70 line-through" : "text-white"
                          }`}
                        >
                          {todo.title}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-[#93a4c7]">
                          <span>마감일: {dueDateInput ?? "미지정"}</span>
                          <span className={todo.completed ? "text-[#6ea8fe]" : "text-white/45"}>
                            {todo.completed ? "완료" : "진행 중"}
                          </span>
                        </div>

                        <p
                          className={`mt-2 truncate text-[12px] leading-5 ${
                            hasNotes ? "text-[#8fb0ec]" : "text-[#6f83aa]"
                          }`}
                          style={{ fontSize: "12px", lineHeight: 1.35 }}
                        >
                          {hasNotes ? todo.notes : "메모가 없습니다."}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 pt-0.5">
                        {isOverdue ? (
                          <Badge tone="overdue" compact>
                            overdue
                          </Badge>
                        ) : null}
                        <Badge tone={todo.priority} compact>
                          {todo.priority}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </div>
    </Card>
  );
}
