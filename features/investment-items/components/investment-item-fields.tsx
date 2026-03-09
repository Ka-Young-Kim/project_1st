"use client";

import { useId, useState } from "react";

import {
  INVESTMENT_ITEM_CATEGORIES,
  INVESTMENT_ITEM_INDUSTRIES,
  InvestmentItemCategory,
} from "@/features/investment-items/lib/category";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cx } from "@/lib/utils";

type InvestmentItemFieldsProps = {
  codePlaceholder: string;
  defaultName?: string;
  defaultCode?: string;
  defaultCategory?: InvestmentItemCategory;
  defaultIndustry?: string | null;
  fieldClassName: string;
  selectFieldClassName: string;
};

export function InvestmentItemFields({
  codePlaceholder,
  defaultName,
  defaultCode,
  defaultCategory = "stock",
  defaultIndustry,
  fieldClassName,
  selectFieldClassName,
}: Readonly<InvestmentItemFieldsProps>) {
  const defaultOptionsByCategory: Record<InvestmentItemCategory, string[]> = {
    stock: [...INVESTMENT_ITEM_INDUSTRIES.stock],
    etf: [...INVESTMENT_ITEM_INDUSTRIES.etf],
    bond: [...INVESTMENT_ITEM_INDUSTRIES.bond],
    gold: [...INVESTMENT_ITEM_INDUSTRIES.gold],
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

  function handleCategoryChange(nextCategory: InvestmentItemCategory) {
    const nextOptions = industryOptionsByCategory[nextCategory];
    const nextDefault = nextOptions[0];

    setCategory(nextCategory);
    setSelectedIndustry(nextDefault);
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <span className="text-sm font-medium">카테고리</span>
          <input type="hidden" name="category" value={category} />
          <div className="grid grid-cols-5 gap-2">
            {INVESTMENT_ITEM_CATEGORIES.map((item) => {
              const active = item.value === category;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleCategoryChange(item.value)}
                  className={cx(
                    "flex items-center justify-center gap-2 rounded-[0.95rem] border px-2.5 py-2 text-left transition",
                    active
                      ? "border-[#8fb6ff]/50 bg-[#203764] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "border-white/10 bg-white/4 text-[#93a4c7] hover:bg-white/8 hover:text-white",
                  )}
                  aria-pressed={active}
                >
                  <span
                    className={cx(
                      "flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-semibold tracking-[0.06em]",
                      active
                        ? "border-[#b8d0ff]/30 bg-[#6ea8fe]/12 text-[#dce8ff]"
                        : "border-white/10 bg-black/10 text-[#b5c5e2]",
                    )}
                  >
                    {getCategoryIconLabel(item.value)}
                  </span>
                  <span className="text-[11px] font-semibold leading-none">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">항목명</span>
          <Input
            name="name"
            required
            defaultValue={defaultName}
            className={`${fieldClassName} py-2.5`}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
      </div>
    </>
  );
}

function getCategoryIconLabel(category: InvestmentItemCategory) {
  switch (category) {
    case "stock":
      return "주";
    case "etf":
      return "E";
    case "bond":
      return "채";
    case "gold":
      return "금";
    default:
      return "기";
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
    case "gold":
      return "금";
    default:
      return "기타";
  }
}
