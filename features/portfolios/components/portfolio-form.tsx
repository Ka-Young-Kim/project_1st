import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createPortfolioAction } from "@/features/portfolios/actions/create-portfolio";

export function PortfolioForm() {
  return (
    <Card className="text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
        Create
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        새 포트폴리오 추가
      </h2>

      <form action={createPortfolioAction} className="mt-6 space-y-4">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-white/88">이름</span>
          <Input name="name" required tone="dark" className="py-2.5" />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-white/88">설명</span>
          <Textarea name="description" tone="dark" className="min-h-24 py-2.5" />
        </label>
        <SubmitButton className="w-full" pendingLabel="저장 중...">
          포트폴리오 저장
        </SubmitButton>
      </form>
    </Card>
  );
}
