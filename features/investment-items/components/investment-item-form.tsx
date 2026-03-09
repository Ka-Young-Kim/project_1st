import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { createInvestmentItemAction } from "@/features/investment-items/actions/create-investment-item";
import { InvestmentItemFields } from "@/features/investment-items/components/investment-item-fields";

export function InvestmentItemForm({
  portfolioId,
}: Readonly<{
  portfolioId: string;
}>) {
  const fieldClassName =
    "appearance-none border-white/12 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";
  const selectFieldClassName =
    `${fieldClassName} [&>option]:bg-[#15203a] [&>option]:text-white`;

  return (
    <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            New Item
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            새 투자 항목 추가
          </h2>
        </div>
      </div>

      <p className="mt-3 text-sm text-[#a8bcdf]">
        항목 추가를 위해서 필수 입력 사항 입니다.
      </p>

      <form action={createInvestmentItemAction} className="mt-5 space-y-5">
        <input type="hidden" name="portfolioId" value={portfolioId} />
        <div className="rounded-[1.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.015))] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8ea4cf]">
            Core Fields
          </p>
          <div className="mt-4">
            <InvestmentItemFields
              codePlaceholder="005930"
              fieldClassName={fieldClassName}
              selectFieldClassName={selectFieldClassName}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-[1.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8ea4cf]">
              Auto Rules
            </p>
            <p className="text-xs leading-5 text-[#a7bbdd]">
              시세 조회 코드는 기본적으로 입력한 코드 값을 그대로 사용합니다. 6자리 한국 종목 코드는 `KRX / KRW`로 자동 설정합니다.
            </p>
          </div>
          <SubmitButton
            className="min-w-[9rem] rounded-[1rem] bg-[linear-gradient(180deg,#76aefd,#5a8ee6)] px-5 py-3 text-sm shadow-[0_12px_24px_rgba(90,142,230,0.24)] hover:bg-[linear-gradient(180deg,#86b8ff,#6798ea)]"
            pendingLabel="저장 중..."
          >
            항목 저장
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
}
