import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createTodoAction } from "@/features/todos/actions/create-todo";
import { getTodayDateInputInSeoul } from "@/lib/utils";

export function TodoForm() {
  const today = getTodayDateInputInSeoul();
  const fieldClassName =
    "appearance-none border-white/12 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";

  return (
    <Card className="h-fit bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            Composer
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            새 TODO 추가
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#93a4c7]">
            제목, 우선순위, 마감일만 먼저 정하고 메모는 필요할 때만 남기세요.
          </p>
        </div>

        <div className="inline-flex h-10 items-center rounded-full border border-[rgba(110,168,254,0.22)] bg-[rgba(110,168,254,0.1)] px-4 text-sm font-semibold text-[#cfe1ff]">
          Quick Add
        </div>
      </div>

      <form action={createTodoAction} className="mt-6 space-y-4.5">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-white/88">제목</span>
          <Input
            name="title"
            placeholder="예: ISA 계좌 리밸런싱 검토"
            required
            className={`${fieldClassName} py-2.5`}
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">우선순위</span>
            <Select
              name="priority"
              defaultValue="medium"
              required
              className={`${fieldClassName} py-2`}
            >
              <option value="low" className="bg-[#141d35] text-white">
                low
              </option>
              <option value="medium" className="bg-[#141d35] text-white">
                medium
              </option>
              <option value="high" className="bg-[#141d35] text-white">
                high
              </option>
            </Select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">마감일</span>
            <Input
              name="dueDate"
              type="date"
              min={today}
              defaultValue=""
              className={`${fieldClassName} py-2`}
            />
          </label>
        </div>

        <label className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-white/88">메모</span>
            <span className="text-xs text-[#93a4c7]">선택 입력</span>
          </div>
          <Textarea
            name="notes"
            placeholder="검토 기준이나 준비물을 남겨두세요"
            className={`${fieldClassName} min-h-24 py-2.5`}
          />
        </label>

        <div className="flex items-center justify-between gap-4 rounded-[1.15rem] border border-white/8 bg-black/10 px-4 py-3">
          <p className="text-xs leading-5 text-[#93a4c7]">
            지난 날짜는 마감일로 입력할 수 없습니다.
          </p>
          <SubmitButton
            className="min-w-[9rem]"
            pendingLabel="TODO 저장 중..."
          >
          TODO 저장
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
}
