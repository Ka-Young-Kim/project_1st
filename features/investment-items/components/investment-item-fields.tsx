"use client";

import { useId, useState } from "react";

import {
  INVESTMENT_ITEM_CATEGORIES,
  INVESTMENT_ITEM_INDUSTRIES,
  InvestmentItemCategory,
  isCodeManagedCategory,
} from "@/features/investment-items/lib/category";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cx } from "@/lib/utils";

type InvestmentItemFieldsProps = {
  codePlaceholder: string;
  categoryLocked?: boolean;
  defaultName?: string;
  defaultCode?: string;
  defaultCategory?: InvestmentItemCategory;
  defaultIndustry?: string | null;
  defaultQuoteSymbol?: string | null;
  defaultExchange?: string | null;
  defaultCurrency?: string | null;
  fieldClassName: string;
  selectFieldClassName: string;
};

export function InvestmentItemFields({
  codePlaceholder,
  categoryLocked = false,
  defaultName,
  defaultCode,
  defaultCategory = "stock",
  defaultIndustry,
  defaultQuoteSymbol,
  defaultExchange,
  defaultCurrency,
  fieldClassName,
  selectFieldClassName,
}: Readonly<InvestmentItemFieldsProps>) {
  const defaultOptionsByCategory: Record<InvestmentItemCategory, string[]> = {
    stock: [...INVESTMENT_ITEM_INDUSTRIES.stock],
    etf: [...INVESTMENT_ITEM_INDUSTRIES.etf],
    bond: [...INVESTMENT_ITEM_INDUSTRIES.bond],
    other: [...INVESTMENT_ITEM_INDUSTRIES.other],
  };
  const [category, setCategory] = useState<InvestmentItemCategory>(defaultCategory);
  const [industryOptionsByCategory, setIndustryOptionsByCategory] = useState<
    Record<InvestmentItemCategory, string[]>
  >(() => defaultOptionsByCategory);
  const [selectedIndustry, setSelectedIndustry] = useState<string>(
    defaultIndustry?.trim() || INVESTMENT_ITEM_INDUSTRIES[defaultCategory][0],
  );
  const [isAddingIndustry, setIsAddingIndustry] = useState(false);
  const [customIndustry, setCustomIndustry] = useState("");
  const industryOptions = industryOptionsByCategory[category];
  const industryId = useId();
  const defaultIndustryOptions = defaultOptionsByCategory[category];
  const isSelectedIndustryCustom = !defaultIndustryOptions.includes(selectedIndustry);
  const supportsCodeInput = isCodeManagedCategory(category);

  function handleCategoryChange(nextCategory: InvestmentItemCategory) {
    const nextOptions = industryOptionsByCategory[nextCategory];
    const nextDefault = nextOptions[0];

    setCategory(nextCategory);
    setSelectedIndustry(isCodeManagedCategory(nextCategory) ? nextDefault : "");
    setIsAddingIndustry(false);
    setCustomIndustry("");
  }

  function startAddIndustry() {
    setIsAddingIndustry(true);
    setCustomIndustry("");
  }

  function addCustomIndustry() {
    const trimmed = customIndustry.trim();

    if (!trimmed) {
      return;
    }

    setIndustryOptionsByCategory((current) => {
      const nextOptions = current[category].includes(trimmed)
        ? current[category]
        : [...current[category], trimmed];

      return {
        ...current,
        [category]: nextOptions,
      };
    });
    setSelectedIndustry(trimmed);
    setIsAddingIndustry(false);
    setCustomIndustry("");
  }

  function cancelAddIndustry() {
    setIsAddingIndustry(false);
    setCustomIndustry("");
  }

  function removeCustomIndustry(option: string) {
    setIndustryOptionsByCategory((current) => {
      if (defaultOptionsByCategory[category].includes(option)) {
        return current;
      }

      const nextOptions = current[category].filter((item) => item !== option);
      const fallback = nextOptions[0] ?? defaultOptionsByCategory[category][0];

      if (selectedIndustry === option) {
        setSelectedIndustry(fallback);
      }

      return {
        ...current,
        [category]: nextOptions,
      };
    });
  }

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <span className="text-sm font-medium">카테고리</span>
          <input type="hidden" name="category" value={category} />
          <div className="grid grid-cols-4 gap-2">
            {INVESTMENT_ITEM_CATEGORIES.map((item) => {
              const active = item.value === category;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={
                    categoryLocked ? undefined : () => handleCategoryChange(item.value)
                  }
                  disabled={categoryLocked}
                  className={cx(
                    "flex items-center justify-center gap-2 rounded-[0.95rem] border px-2.5 py-2 text-left transition",
                    active
                      ? "border-[#8fb6ff]/50 bg-[#203764] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "border-white/10 bg-white/4 text-[#93a4c7] hover:bg-white/8 hover:text-white",
                    categoryLocked ? "cursor-not-allowed" : "",
                    categoryLocked && !active
                      ? "opacity-55 hover:bg-white/4 hover:text-[#93a4c7]"
                      : "",
                  )}
                  aria-pressed={active}
                  aria-disabled={categoryLocked}
                >
                  <span
                    className={cx(
                      "flex h-7 w-7 items-center justify-center rounded-full border",
                      active
                        ? "border-[#b8d0ff]/30 bg-white/10"
                        : "border-white/10 bg-black/10",
                    )}
                  >
                    <CategoryIcon category={item.value} active={active} />
                  </span>
                  <span className="text-[11px] font-semibold leading-none">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={cx(
            "grid gap-4",
            supportsCodeInput ? "md:grid-cols-2" : "md:grid-cols-1",
          )}
        >
          <label className="space-y-1.5">
            <span className="text-sm font-medium">항목명</span>
            <Input
              name="name"
              required
              defaultValue={defaultName}
              className={`${fieldClassName} py-2.5`}
            />
          </label>

          {supportsCodeInput ? (
            <label className="space-y-1.5">
              <span className="text-sm font-medium">코드</span>
              <Input
                name="code"
                required
                defaultValue={defaultCode}
                placeholder={codePlaceholder}
                maxLength={20}
                className={`${fieldClassName} py-2.5`}
              />
            </label>
          ) : (
            <input type="hidden" name="code" value="" />
          )}
        </div>

        {supportsCodeInput ? (
          <>
            <label className="space-y-1.5">
              <span className="text-sm font-medium" id={industryId}>산업</span>
              <input type="hidden" name="industry" value={selectedIndustry} />
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select
                    value={selectedIndustry}
                    onChange={(event) => setSelectedIndustry(event.target.value)}
                    aria-labelledby={industryId}
                    className={`${selectFieldClassName} py-2`}
                  >
                    {industryOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                  <button
                    type="button"
                    onClick={startAddIndustry}
                    className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[1rem] border border-[#6ea8fe]/28 bg-[#6ea8fe]/12 text-lg font-semibold text-[#dbe7ff] transition hover:bg-[#6ea8fe]/18"
                    aria-label="산업 선택지 추가"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCustomIndustry(selectedIndustry)}
                    disabled={!isSelectedIndustryCustom}
                    className={cx(
                      "inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[1rem] border text-lg font-semibold transition",
                      isSelectedIndustryCustom
                        ? "border-rose-300/18 bg-rose-400/10 text-rose-100 hover:bg-rose-400/18"
                        : "cursor-not-allowed border-white/8 bg-white/4 text-[#62779f] opacity-60",
                    )}
                    aria-label="선택한 커스텀 산업 제거"
                  >
                    -
                  </button>
                </div>

                {isAddingIndustry ? (
                  <div className="flex gap-2">
                    <Input
                      value={customIndustry}
                      onChange={(event) => setCustomIndustry(event.target.value)}
                      placeholder="새 산업 입력"
                      className={`${fieldClassName} py-2`}
                    />
                    <button
                      type="button"
                      onClick={addCustomIndustry}
                      className="inline-flex h-[42px] shrink-0 items-center justify-center rounded-[1rem] border border-[#8fb6ff]/28 bg-[#203764] px-4 text-sm font-semibold text-white transition hover:bg-[#29457a]"
                    >
                      추가
                    </button>
                    <button
                      type="button"
                      onClick={cancelAddIndustry}
                      className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[1rem] border border-white/10 bg-white/4 text-lg font-semibold text-[#9db2d8] transition hover:bg-white/8 hover:text-white"
                      aria-label="산업 추가 취소"
                    >
                      ×
                    </button>
                  </div>
                ) : null}

                <div className="flex min-h-7 flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#6ea8fe]/10 px-2.5 py-1 text-[11px] font-medium text-[#bcd3ff]">
                    {getCategoryLabel(category)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/6 px-2.5 py-1 text-[11px] font-medium text-[#d6e4ff]">
                    {selectedIndustry}
                  </span>
                  {industryOptions
                    .filter((option) => !defaultIndustryOptions.includes(option))
                    .map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => removeCustomIndustry(option)}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-300/18 bg-rose-400/10 px-2.5 py-1 text-[11px] font-medium text-rose-100 transition hover:bg-rose-400/18"
                      >
                        <span>{option}</span>
                        <span className="text-rose-200/80">×</span>
                      </button>
                    ))}
                </div>
              </div>
            </label>

            <details className="group rounded-[1rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.015))]">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-2.5 text-sm font-semibold text-[#dbe7ff] marker:hidden">
                <span>고급 설정</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/4 text-base leading-none text-[#bcd3ff] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="border-t border-white/8 px-3.5 py-3.5">
                <p className="text-xs leading-5 text-[#93a4c7]">
                  보통은 비워두면 자동으로 채워집니다.
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium">시세 심볼</span>
                    <Input
                      name="quoteSymbol"
                      defaultValue={defaultQuoteSymbol ?? ""}
                      placeholder="005930 또는 AAPL"
                      className={`${fieldClassName} py-2.5`}
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium">거래소</span>
                    <Input
                      name="exchange"
                      defaultValue={defaultExchange ?? ""}
                      placeholder="KRX, NASDAQ"
                      className={`${fieldClassName} py-2.5`}
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium">통화</span>
                    <Input
                      name="currency"
                      defaultValue={defaultCurrency ?? ""}
                      placeholder="KRW, USD"
                      className={`${fieldClassName} py-2.5`}
                    />
                  </label>
                </div>
              </div>
            </details>
          </>
        ) : (
          <>
            <input type="hidden" name="industry" value="" />
            <input type="hidden" name="quoteSymbol" value={defaultQuoteSymbol ?? ""} />
            <input type="hidden" name="exchange" value={defaultExchange ?? ""} />
            <input type="hidden" name="currency" value={defaultCurrency ?? ""} />
          </>
        )}
      </div>
    </>
  );
}

function CategoryIcon({
  category,
  active,
}: Readonly<{
  category: InvestmentItemCategory;
  active: boolean;
}>) {
  const tone = active ? "text-[#dce8ff]" : "text-[#8fa4cb]";
  const fillTone = active ? "rgba(110,168,254,0.2)" : "rgba(255,255,255,0.06)";

  switch (category) {
    case "stock":
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${tone}`} fill="none" aria-hidden="true">
          <path d="M5 16.5 10 11.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 7.5h4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18.5" cy="7.5" r="2.5" fill={fillTone} />
        </svg>
      );
    case "etf":
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${tone}`} fill="none" aria-hidden="true">
          <rect x="4.5" y="6" width="5" height="12" rx="2" fill={fillTone} stroke="currentColor" strokeWidth="1.8" />
          <rect x="9.5" y="9" width="5" height="9" rx="2" fill={fillTone} stroke="currentColor" strokeWidth="1.8" />
          <rect x="14.5" y="4" width="5" height="14" rx="2" fill={fillTone} stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "bond":
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${tone}`} fill="none" aria-hidden="true">
          <rect x="5" y="4.5" width="14" height="15" rx="2.5" fill={fillTone} stroke="currentColor" strokeWidth="1.9" />
          <path d="M8.5 9h7M8.5 12h7M8.5 15h4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${tone}`} fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="7" fill={fillTone} stroke="currentColor" strokeWidth="1.9" />
          <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      );
  }
}

function getCategoryLabel(category: InvestmentItemCategory) {
  switch (category) {
    case "stock":
      return "주식";
    case "etf":
      return "ETF";
    case "bond":
      return "채권";
    default:
      return "기타";
  }
}
