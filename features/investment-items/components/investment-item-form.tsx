import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createInvestmentItemAction } from "@/features/investment-items/actions/create-investment-item";

export function InvestmentItemForm({
  portfolioId,
}: Readonly<{
  portfolioId: string;
}>) {
  const fieldClassName =
    "appearance-none border-white/12 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";

  return (
    <Card className="h-fit bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            Registry
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            새 투자 항목 추가
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#93a4c7]">
            항목 메타 정보와 운영 메모를 먼저 정리해두고 투자일지에서 선택해 사용합니다.
          </p>
        </div>
      </div>

      <form action={createInvestmentItemAction} className="mt-6 space-y-4">
        <input type="hidden" name="portfolioId" value={portfolioId} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">항목명</span>
            <Input name="name" required placeholder="엔비디아" className={`${fieldClassName} py-2.5`} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">코드</span>
            <Input
              name="code"
              required
              placeholder="NVDA"
              maxLength={20}
              className={`${fieldClassName} py-2.5`}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">카테고리</span>
            <Input name="category" placeholder="주식, ETF" className={`${fieldClassName} py-2`} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">산업</span>
            <Input name="industry" placeholder="반도체, 소프트웨어" className={`${fieldClassName} py-2`} />
          </label>
        </div>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-white/88">메모</span>
          <Textarea
            name="notes"
            placeholder="이 항목을 어떤 기준으로 관리할지 적어두세요"
            className={`${fieldClassName} min-h-24 py-2.5`}
          />
        </label>

        <label className="inline-flex items-center gap-3 rounded-[1rem] border border-white/8 bg-black/10 px-4 py-3 text-sm text-white/88">
          <input type="checkbox" name="active" defaultChecked className="h-4 w-4 accent-[#6ea8fe]" />
          활성 항목으로 바로 사용
        </label>

        <div className="flex items-center justify-between gap-4 rounded-[1.15rem] border border-white/8 bg-black/10 px-4 py-3">
          <p className="text-xs leading-5 text-[#93a4c7]">
            등록된 항목은 투자일지 작성 시 선택해서 연결할 수 있습니다.
          </p>
          <SubmitButton className="min-w-[9rem]" pendingLabel="저장 중...">
            항목 저장
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
}
