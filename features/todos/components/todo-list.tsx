import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { deleteTodoAction } from "@/features/todos/actions/delete-todo";
import { toggleTodoAction } from "@/features/todos/actions/toggle-todo";
import { updateTodoAction } from "@/features/todos/actions/update-todo";
import { TodoListItem } from "@/features/todos/types";
import { formatDateInput } from "@/lib/utils";

export function TodoList({ todos }: Readonly<{ todos: TodoListItem[] }>) {
  return (
    <Card>
      <div>
        <h2 className="text-xl font-semibold">TODO 목록</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          미완료 항목이 먼저 오고, 마감일 순으로 정렬됩니다.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {todos.length === 0 ? (
          <EmptyState
            title="등록된 TODO가 없습니다"
            description="첫 TODO를 추가해 오늘 할 일을 기록하세요."
          />
        ) : (
          todos.map((todo) => (
            <article
              key={todo.id}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold">{todo.title}</h3>
                    <Badge tone={todo.priority}>{todo.priority}</Badge>
                    <Badge tone={todo.completed ? "done" : "open"}>
                      {todo.completed ? "done" : "open"}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--muted)]">
                    마감일: {todo.dueDate ? formatDateInput(todo.dueDate) : "미지정"}
                  </p>
                  {todo.notes ? (
                    <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
                      {todo.notes}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <form action={toggleTodoAction}>
                    <input type="hidden" name="id" value={todo.id} />
                    <input
                      type="hidden"
                      name="completed"
                      value={todo.completed ? "false" : "true"}
                    />
                    <button
                      type="submit"
                      className="rounded-2xl border border-[var(--border)] bg-stone-50 px-4 py-3 text-sm font-semibold transition hover:bg-stone-100"
                    >
                      {todo.completed ? "다시 열기" : "완료 처리"}
                    </button>
                  </form>

                  <form action={deleteTodoAction}>
                    <input type="hidden" name="id" value={todo.id} />
                    <ConfirmSubmitButton
                      confirmMessage="이 TODO를 완전히 삭제하시겠습니까?"
                      className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      삭제
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>

              <details className="mt-5 rounded-[1.25rem] border border-dashed border-[var(--border)] p-4">
                <summary className="cursor-pointer text-sm font-semibold">
                  항목 수정
                </summary>
                <form action={updateTodoAction} className="mt-4 space-y-4">
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
                      <Select name="priority" defaultValue={todo.priority} required>
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
                        defaultValue={todo.dueDate ? formatDateInput(todo.dueDate) : ""}
                      />
                    </label>
                  </div>

                  <label className="space-y-2">
                    <span className="text-sm font-medium">메모</span>
                    <Textarea name="notes" defaultValue={todo.notes ?? ""} />
                  </label>

                  <SubmitButton pendingLabel="수정 저장 중...">수정 저장</SubmitButton>
                </form>
              </details>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
