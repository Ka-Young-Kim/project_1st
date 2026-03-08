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
import { toggleTodoAction } from "@/features/todos/actions/toggle-todo";
import { updateTodoAction } from "@/features/todos/actions/update-todo";
import { TodoListItem } from "@/features/todos/types";
import { formatDateInput, getTodayDateInputInSeoul } from "@/lib/utils";

export function TodoList({ todos }: Readonly<{ todos: TodoListItem[] }>) {
  const today = getTodayDateInputInSeoul();

  return (
    <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
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

            return (
              <article
                key={todo.id}
                className="rounded-[1.25rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(22,32,58,.96),rgba(20,29,53,.96))] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,.18)]"
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
                        <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] p-5 text-white shadow-[0_14px_40px_rgba(0,0,0,.28)] sm:p-6">
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
                            <input
                              type="hidden"
                              name="completed"
                              value={todo.completed ? "true" : "false"}
                            />

                            <label className="space-y-2">
                              <span className="text-sm font-medium">제목</span>
                              <Input name="title" defaultValue={todo.title} required />
                            </label>

                            <div className="grid gap-4 md:grid-cols-2">
                              <label className="space-y-2">
                                <span className="text-sm font-medium">우선순위</span>
                                <Select
                                  name="priority"
                                  defaultValue={todo.priority}
                                  required
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
                                />
                              </label>
                            </div>

                            <label className="space-y-2">
                              <span className="text-sm font-medium">메모</span>
                              <Textarea name="notes" defaultValue={todo.notes ?? ""} />
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

                  <p className="mt-2 text-sm leading-6 text-[#8fb0ec]">
                    {todo.notes || "메모가 없습니다."}
                  </p>
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
