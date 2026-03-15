import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { deleteTodoAction } from "@/features/todos/actions/delete-todo";
import { toggleTodoAction } from "@/features/todos/actions/toggle-todo";
import { updateTodoAction } from "@/features/todos/actions/update-todo";
import type { TodoListItem } from "@/features/todos/types";
import { formatDateInput, getTodayDateInputInSeoul } from "@/lib/utils";

export function TodoInspector({
  todo,
  currentMonth,
  selectedDate,
}: Readonly<{
  todo?: TodoListItem;
  currentMonth: string;
  selectedDate?: string;
}>) {
  const today = getTodayDateInputInSeoul();
  const dueDateInput = todo?.dueDate ? formatDateInput(todo.dueDate) : "";

  if (!todo) {
    return (
      <Card className="sticky top-5 border-white/8 bg-[linear-gradient(180deg,rgba(18,28,52,.98),rgba(14,22,42,.98))] p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
          Inspector
        </p>
        <h2 className="mt-3 text-[1.15rem] font-semibold tracking-tight">
          일정을 선택하세요
        </h2>
        <p className="mt-2 text-[13px] leading-6 text-[#9fb4d8]">
          왼쪽 일정 목록에서 항목을 선택하면 메모와 우선순위를 이 패널에서 바로 수정할 수 있습니다.
        </p>
      </Card>
    );
  }

  return (
    <Card className="sticky top-5 border-white/8 bg-[linear-gradient(180deg,rgba(18,28,52,.98),rgba(14,22,42,.98))] p-5 text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            Inspector
          </p>
          <h2 className="mt-3 text-[1.2rem] font-semibold tracking-tight">
            {todo.title}
          </h2>
          <p className="mt-2 text-[12px] text-[#9fb4d8]">
            {todo.completed ? "완료된 일정" : "진행 중 일정"} · 우선순위 {todo.priority}
          </p>
        </div>
        <form action={toggleTodoAction}>
          <input type="hidden" name="id" value={todo.id} />
          <input type="hidden" name="completed" value={todo.completed ? "false" : "true"} />
          <input type="hidden" name="redirectMonth" value={currentMonth} />
          <input type="hidden" name="redirectDate" value={selectedDate ?? ""} />
          <input type="hidden" name="redirectTodo" value={todo.id} />
          <button
            type="submit"
            className={`inline-flex h-9 items-center rounded-[0.85rem] border px-3 text-[12px] font-semibold transition ${
              todo.completed
                ? "border-[#8fb6ff]/28 bg-[#6ea8fe]/14 text-[#d8e6ff] hover:bg-[#6ea8fe]/22"
                : "border-emerald-300/20 bg-emerald-400/12 text-emerald-100 hover:bg-emerald-400/18"
            }`}
          >
            {todo.completed ? "다시 열기" : "완료 처리"}
          </button>
        </form>
      </div>

      <form action={updateTodoAction} className="mt-5 space-y-4">
        <input type="hidden" name="id" value={todo.id} />
        <input type="hidden" name="redirectMonth" value={currentMonth} />
        <input type="hidden" name="redirectDate" value={selectedDate ?? ""} />
        <input type="hidden" name="redirectTodo" value={todo.id} />
        <input type="hidden" name="completed" value={todo.completed ? "true" : "false"} />

        <label className="space-y-2">
          <span className="text-sm font-medium">제목</span>
          <Input name="title" defaultValue={todo.title} required tone="dark" />
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
              defaultValue={dueDateInput}
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
            className="min-h-40 py-2.5"
          />
        </label>

        <SubmitButton className="w-full" pendingLabel="수정 저장 중...">
          수정 저장
        </SubmitButton>
      </form>

      <form action={deleteTodoAction} className="mt-3">
        <input type="hidden" name="id" value={todo.id} />
        <input type="hidden" name="redirectMonth" value={currentMonth} />
        <input type="hidden" name="redirectDate" value={selectedDate ?? ""} />
        <ConfirmSubmitButton
          confirmMessage="이 TODO를 완전히 삭제하시겠습니까?"
          className="w-full rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
        >
          삭제
        </ConfirmSubmitButton>
      </form>
    </Card>
  );
}
