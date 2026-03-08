import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createTodoAction } from "@/features/todos/actions/create-todo";

export function TodoForm() {
  return (
    <Card className="h-fit">
      <div>
        <h2 className="text-xl font-semibold">새 TODO 추가</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          마감일과 우선순위를 함께 기록해 오늘 처리할 항목을 구분합니다.
        </p>
      </div>

      <form action={createTodoAction} className="mt-6 space-y-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">제목</span>
          <Input name="title" placeholder="예: ISA 계좌 리밸런싱 검토" required />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">우선순위</span>
            <Select name="priority" defaultValue="medium" required>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </Select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium">마감일</span>
            <Input name="dueDate" type="date" />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium">메모</span>
          <Textarea
            name="notes"
            placeholder="검토 기준이나 준비물을 남겨두세요"
          />
        </label>

        <SubmitButton className="w-full" pendingLabel="TODO 저장 중...">
          TODO 저장
        </SubmitButton>
      </form>
    </Card>
  );
}
