export const INVESTMENT_ITEM_CATEGORIES = [
  { value: "stock", label: "주식" },
  { value: "etf", label: "ETF" },
  { value: "bond", label: "채권" },
  { value: "other", label: "기타" },
] as const;

export const INVESTMENT_ITEM_INDUSTRIES = {
  stock: [
    "반도체",
    "인터넷",
    "자동차",
    "배터리",
    "금융",
    "바이오",
    "소비재",
    "에너지",
    "산업재",
    "기타",
  ],
  etf: [
    "지수",
    "해외지수",
    "채권",
    "원자재",
    "배당",
    "섹터",
    "기타",
  ],
  bond: [
    "국채",
    "회사채",
    "단기채",
    "장기채",
    "기타",
  ],
  other: [
    "기타",
  ],
} as const;

export type InvestmentItemCategory =
  (typeof INVESTMENT_ITEM_CATEGORIES)[number]["value"];

export function isCodeManagedCategory(category: InvestmentItemCategory) {
  return category === "stock" || category === "etf";
}

export function normalizeInvestmentItemCategory(value?: string | null) {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return "other" as const;
  }

  if (["stock", "주식"].includes(normalized)) {
    return "stock" as const;
  }

  if (["etf"].includes(normalized)) {
    return "etf" as const;
  }

  if (["bond", "채권"].includes(normalized)) {
    return "bond" as const;
  }

  return "other" as const;
}

export function getInvestmentItemCategoryLabel(value?: string | null) {
  const normalized = normalizeInvestmentItemCategory(value);

  return (
    INVESTMENT_ITEM_CATEGORIES.find((item) => item.value === normalized)?.label ??
    "기타"
  );
}

export function getInvestmentItemCategoryRank(value?: string | null) {
  const normalized = normalizeInvestmentItemCategory(value);

  return INVESTMENT_ITEM_CATEGORIES.findIndex((item) => item.value === normalized);
}

export function normalizeInvestmentItemIndustry(
  category: InvestmentItemCategory,
  value?: string | null,
) {
  if (!isCodeManagedCategory(category)) {
    return "";
  }

  const trimmed = value?.trim();

  if (!trimmed) {
    return INVESTMENT_ITEM_INDUSTRIES[category][0] ?? "";
  }

  return trimmed;
}
