import { Fragment } from "react";

import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { createInvestmentItemAction } from "@/features/investment-items/actions/create-investment-item";
import { InvestmentItemFields } from "@/features/investment-items/components/investment-item-fields";

export function InvestmentItemForm({
  portfolioId,
  embedded = false,
}: Readonly<{
  portfolioId: string;
  embedded?: boolean;
}>) {
  const fieldClassName =
    "appearance-none border-white/12 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";
  const selectFieldClassName =
    `${fieldClassName} [&>option]:bg-[#15203a] [&>option]:text-white`;
  const Wrapper = embedded ? Fragment : Card;
  const wrapperProps = embedded
    ? {}
    : {
        className:
          "bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]",
      };

  return (
    <Wrapper {...wrapperProps}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            New Item
          </p>
          <h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight">
            새 투자 항목 추가
          </h2>
        </div>
      </div>

      <p className="mt-2 text-[13px] text-[#a8bcdf]">
        항목 추가를 위해서 필수 입력 사항 입니다.
      </p>

      <form action={createInvestmentItemAction} className="mt-4 space-y-4">
        <input type="hidden" name="portfolioId" value={portfolioId} />
        <div className="rounded-[1rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.015))] p-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8ea4cf]">
            Core Fields
          </p>
          <div className="mt-3">
            <InvestmentItemFields
              codePlaceholder="005930"
              defaultQuoteSymbol=""
              defaultExchange=""
              defaultCurrency=""
              fieldClassName={fieldClassName}
              selectFieldClassName={selectFieldClassName}
            />
          </div>
        </div>

        <SubmitButton
          className="w-full rounded-[0.95rem] bg-[linear-gradient(180deg,#76aefd,#5a8ee6)] px-4 py-2.5 text-sm shadow-[0_10px_20px_rgba(90,142,230,0.22)] hover:bg-[linear-gradient(180deg,#86b8ff,#6798ea)]"
          pendingLabel="저장 중..."
        >
          항목 저장
        </SubmitButton>
      </form>
    </Wrapper>
  );
}
