import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { deleteInvestmentItemAction } from "@/features/investment-items/actions/delete-investment-item";
import { updateInvestmentItemAction } from "@/features/investment-items/actions/update-investment-item";
import { InvestmentItemFields } from "@/features/investment-items/components/investment-item-fields";
import type { InvestmentItemCategory } from "@/features/investment-items/lib/category";

type InvestmentItemInspectorEntry = {
  id: string;
  portfolioId: string | null;
  name: string;
  code: string;
  quoteSymbol: string | null;
  exchange: string | null;
  currency: string | null;
  category: InvestmentItemCategory;
  categoryLabel: string;
  industry: string | null;
  active: boolean;
  logCount: number;
  isHolding: boolean;
  updatedAt: Date;
};

const fieldClassName =
  "appearance-none border-white/12 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";
const selectFieldClassName =
  `${fieldClassName} [&>option]:bg-[#15203a] [&>option]:text-white`;

export function InvestmentItemInspector({
  item,
  portfolioName,
  selectedCategory,
}: Readonly<{
  item?: InvestmentItemInspectorEntry;
  portfolioName?: string;
  selectedCategory?: InvestmentItemCategory | "all";
}>) {
  if (!item) {
    return (
      <Card className="sticky top-5 border-white/8 bg-[linear-gradient(180deg,rgba(18,28,52,.98),rgba(14,22,42,.98))] p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
          Inspector
        </p>
        <h2 className="mt-3 text-[1.15rem] font-semibold tracking-tight">
          항목을 선택하세요
        </h2>
        <p className="mt-2 text-[13px] leading-6 text-[#9fb4d8]">
          왼쪽 목록에서 {"›"} 버튼으로 항목을 선택하면 코드, 산업, 시세 심볼과 연결 상태를 이 패널에서 바로 수정할 수 있습니다.
        </p>
        <div className="mt-5 rounded-[1rem] border border-dashed border-white/10 bg-white/4 px-4 py-4 text-[13px] leading-6 text-[#89a0c7]">
          {portfolioName
            ? `${portfolioName} 포트폴리오 기준 ${selectedCategory === "all" || !selectedCategory ? "전체" : "선택 카테고리"} 항목을 보고 있습니다.`
            : "먼저 포트폴리오를 선택하면 항목 상세를 이 영역에서 편집할 수 있습니다."}
        </div>
      </Card>
    );
  }

  const updateFormId = `investment-item-update-${item.id}`;
  const deleteFormId = `investment-item-delete-${item.id}`;

  return (
    <Card className="sticky top-5 border-white/8 bg-[linear-gradient(180deg,rgba(18,28,52,.98),rgba(14,22,42,.98))] p-5 text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            Inspector
          </p>
          <h2 className="mt-3 text-[1.25rem] font-semibold tracking-tight">
            {item.name}
          </h2>
          <p className="mt-2 text-[12px] text-[#9fb4d8]">
            {item.categoryLabel} · 로그 {item.logCount}건 · {item.isHolding ? "보유중" : "미보유"}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
            item.active
              ? "border border-emerald-300/20 bg-emerald-400/12 text-emerald-100"
              : "border border-white/8 bg-white/5 text-[#9db2d8]"
          }`}
        >
          {item.active ? "active" : "inactive"}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Metric label="코드" value={item.code} />
        <Metric label="최근 수정" value={item.updatedAt.toLocaleDateString("ko-KR")} />
      </div>

      <form
        id={updateFormId}
        action={updateInvestmentItemAction}
        className="mt-5 space-y-4"
      >
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="portfolioId" value={item.portfolioId ?? ""} />
        <input type="hidden" name="redirectCategory" value={selectedCategory ?? "all"} />
        <input type="hidden" name="redirectItem" value={item.id} />

        <InvestmentItemFields
          codePlaceholder="005930 또는 AAPL"
          categoryLocked
          defaultName={item.name}
          defaultCode={item.code}
          defaultCategory={item.category}
          defaultIndustry={item.industry}
          defaultQuoteSymbol={item.quoteSymbol ?? ""}
          defaultExchange={item.exchange ?? ""}
          defaultCurrency={item.currency ?? ""}
          fieldClassName={fieldClassName}
          selectFieldClassName={selectFieldClassName}
        />

        <label className="space-y-1.5">
          <span className="text-sm font-medium">상태</span>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 rounded-[0.95rem] border border-white/10 bg-white/4 px-3 py-2 text-sm text-white">
              <input
                name="active"
                type="checkbox"
                defaultChecked={item.active}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              활성
            </label>
            <div className="rounded-[0.95rem] border border-white/8 bg-white/4 px-3 py-2 text-[12px] text-[#9fb4d8]">
              비활성 항목은 선택 목록에서 숨길 수 있습니다.
            </div>
          </div>
        </label>
      </form>

      <form id={deleteFormId} action={deleteInvestmentItemAction}>
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="portfolioId" value={item.portfolioId ?? ""} />
        <input type="hidden" name="redirectCategory" value={selectedCategory ?? "all"} />
        <input type="hidden" name="redirectItem" value={item.id} />
      </form>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="submit"
          form={updateFormId}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,#76aefd,#5a8ee6)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(90,142,230,0.22)] transition hover:bg-[linear-gradient(180deg,#86b8ff,#6798ea)]"
        >
          수정 저장
        </button>
        <ConfirmSubmitButton
          form={deleteFormId}
          confirmMessage="이 투자 항목을 삭제하시겠습니까? 연결된 투자일지가 있으면 삭제되지 않습니다."
          className="w-full rounded-[1rem] border border-rose-300/30 bg-rose-400/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
        >
          삭제
        </ConfirmSubmitButton>
      </div>
    </Card>
  );
}

function Metric({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-[1rem] border border-white/8 bg-white/4 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
        {label}
      </p>
      <p className="mt-1.5 text-[13px] font-semibold text-white">{value}</p>
    </div>
  );
}
