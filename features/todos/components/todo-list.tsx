import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { deleteTodoAction } from "@/features/todos/actions/delete-todo";
import { TodoForm } from "@/features/todos/components/todo-form";
import { toggleTodoAction } from "@/features/todos/actions/toggle-todo";
import { updateTodoAction } from "@/features/todos/actions/update-todo";
import { TodoListItem } from "@/features/todos/types";
import { formatDateInput, getTodayDateInputInSeoul } from "@/lib/utils";

export function TodoList({
  todos,
  currentMonth,
  selectedDate,
  viewAllHref = "/todos",
}: Readonly<{
  todos: TodoListItem[];
  currentMonth: string;
  selectedDate?: string;
  viewAllHref?: string;
}>) {
  const today = getTodayDateInputInSeoul();

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
              <TodoForm embedded />
            </Card>
          </SettingsDialog>
        </div>
      </div>
      <div className="space-y-3 overflow-y-auto pr-1 xl:max-h-[39rem]">
        {todos.length === 0 ? (
          <EmptyState
            title="등록된 TODO가 없습니다"
            description="아래에서 새 TODO를 추가하면 여기서 바로 확인할 수 있습니다."
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
                className="rounded-[1.25rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(22,32,58,.96),rgba(20,29,53,.96))] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,.18)] transition hover:border-[#8fb6ff]/18"
              >
                <div className="flex items-start gap-3">
                <form action={toggleTodoAction} className="pt-1">
                  <input type="hidden" name="id" value={todo.id} />
                  <input
                    type="hidden"
                    name="completed"
                    value={todo.completed ? "false" : "true"}
                  />
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

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <SettingsDialog
                        trigger={
                          <button
                            type="button"
                            className={`cursor-pointer text-left text-[1.05rem] font-semibold leading-snug tracking-tight transition hover:text-[#8fb0ec] ${
                              todo.completed
                                ? "text-white/70 line-through"
                                : "text-white"
                            }`}
                          >
                            {todo.title}
                          </button>
                        }
                      >
                        <Card surface="dialog" className="p-5 sm:p-6">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
                              Todo Item
                            </p>
                            <h3 className="mt-3 text-2xl font-semibold">
                              {todo.title}
                            </h3>
                          </div>

                          <form action={updateTodoAction} className="mt-6 space-y-4">
                            <input type="hidden" name="id" value={todo.id} />
                            <input type="hidden" name="redirectMonth" value={currentMonth} />
                            <input type="hidden" name="redirectDate" value={selectedDate ?? ""} />
                            <input
                              type="hidden"
                              name="completed"
                              value={todo.completed ? "true" : "false"}
                            />

                            <label className="space-y-2">
                              <span className="text-sm font-medium">제목</span>
                              <Input
                                name="title"
                                defaultValue={todo.title}
                                required
                                tone="dark"
                              />
                            </label>

                            <div className="grid gap-4 md:grid-cols-2">
                              <label className="space-y-2">
                                <span className="text-sm font-medium">우선순위</span>
                                <Select
                                  name="priority"
                                  defaultValue={todo.priority}
                                  required
                                  tone="dark"
                                >
                                  <option value="low">low</option>
                                  <option value="medium">medium</option>
                                  <option value="high">high</option>
                                </Select>
                              </label>
                              <label className="space-y-2">
                                <span className="text-sm font-medium">마감일</span>
                                <Input
                                  name="dueDate"
                                  type="date"
                                  min={today}
                                  defaultValue={dueDateInput ?? ""}
                                  tone="dark"
                                />
                              </label>
                            </div>

                            <label className="space-y-2">
                              <span className="text-sm font-medium">메모</span>
                              <Textarea
                                name="notes"
                                defaultValue={todo.notes ?? ""}
                                tone="dark"
                              />
                            </label>

                            <SubmitButton
                              className="w-full"
                              pendingLabel="수정 저장 중..."
                            >
                              수정 저장
                            </SubmitButton>
                          </form>

                          <form action={deleteTodoAction} className="mt-3">
                            <input type="hidden" name="id" value={todo.id} />
                            <ConfirmSubmitButton
                              confirmMessage="이 TODO를 완전히 삭제하시겠습니까?"
                              className="w-full rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                            >
                              삭제
                            </ConfirmSubmitButton>
                          </form>
                        </Card>
                      </SettingsDialog>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-[#93a4c7]">
                        <span>마감일: {dueDateInput ?? "미지정"}</span>
                        <span className={todo.completed ? "text-[#6ea8fe]" : "text-white/45"}>
                          {todo.completed ? "완료" : "진행 중"}
                        </span>
                      </div>
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

                  {hasNotes ? (
                    <SettingsDialog
                      trigger={
                        <button
                          type="button"
                          className="mt-2 block w-full truncate text-left text-[12px] leading-5 text-[#8fb0ec] transition hover:text-[#bfd4ff]"
                          aria-label={`${todo.title} 메모 자세히 보기`}
                          style={{ fontSize: "12px", lineHeight: 1.35 }}
                        >
                          {todo.notes}
                        </button>
                      }
                    >
                      <Card surface="dialog" className="p-5 sm:p-6">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
                            Todo Memo
                          </p>
                          <h3 className="mt-3 text-xl font-semibold text-white">
                            {todo.title}
                          </h3>
                        </div>
                        <form action={updateTodoAction} className="mt-5 space-y-4">
                          <input type="hidden" name="id" value={todo.id} />
                          <input type="hidden" name="redirectMonth" value={currentMonth} />
                          <input type="hidden" name="redirectDate" value={selectedDate ?? ""} />
                          <input type="hidden" name="title" value={todo.title} />
                          <input
                            type="hidden"
                            name="priority"
                            value={todo.priority}
                          />
                          <input
                            type="hidden"
                            name="dueDate"
                            value={dueDateInput ?? ""}
                          />
                          <input
                            type="hidden"
                            name="completed"
                            value={todo.completed ? "true" : "false"}
                          />
                          <label className="block space-y-2">
                            <span className="text-sm font-medium text-white/88">
                              메모
                            </span>
                            <Textarea
                              name="notes"
                              defaultValue={todo.notes ?? ""}
                              tone="dark"
                              rows={6}
                            />
                          </label>
                          <SubmitButton
                            className="w-full"
                            pendingLabel="메모 저장 중..."
                          >
                            수정 저장
                          </SubmitButton>
                        </form>
                      </Card>
                    </SettingsDialog>
                  ) : (
                    <p
                      className="mt-2 text-[12px] leading-5 text-[#8fb0ec]"
                      style={{ fontSize: "12px", lineHeight: 1.35 }}
                    >
                      메모가 없습니다.
                    </p>
                  )}
                </div>
              </div>
              </article>
            );
          })
        )}
      </div>
    </Card>
  );
}
