import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createPortfolioAction } from "@/features/portfolios/actions/create-portfolio";

export function PortfolioForm() {
  const fieldClassName =
    "appearance-none border-white/12 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";

  return (
    <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
        Create
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        새 포트폴리오 추가
      </h2>

      <form action={createPortfolioAction} className="mt-6 space-y-4">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-white/88">이름</span>
          <Input name="name" required className={`${fieldClassName} py-2.5`} />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-white/88">설명</span>
          <Textarea name="description" className={`${fieldClassName} min-h-24 py-2.5`} />
        </label>
        <label className="inline-flex items-center gap-3 rounded-[1rem] border border-white/8 bg-black/10 px-4 py-3 text-sm text-white/88">
          <input type="checkbox" name="active" defaultChecked className="h-4 w-4 accent-[#6ea8fe]" />
          활성 포트폴리오
        </label>
        <SubmitButton className="w-full" pendingLabel="저장 중...">
          포트폴리오 저장
        </SubmitButton>
      </form>
    </Card>
  );
}
