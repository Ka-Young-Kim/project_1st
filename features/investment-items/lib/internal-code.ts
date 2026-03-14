import {
  InvestmentItemCategory,
  isCodeManagedCategory,
} from "@/features/investment-items/lib/category";

const CATEGORY_PREFIX: Record<InvestmentItemCategory, string> = {
  stock: "STOCK",
  etf: "ETF",
  bond: "BOND",
  other: "OTHER",
};

export function buildInvestmentItemCode({
  name,
  category,
  providedCode,
  index = 0,
}: {
  name: string;
  category: InvestmentItemCategory;
  providedCode?: string | null;
  index?: number;
}) {
  const normalizedCode = providedCode?.trim().toUpperCase() ?? "";

  if (isCodeManagedCategory(category)) {
    return normalizedCode;
  }

  if (normalizedCode) {
    return normalizedCode;
  }

  const digits = Date.now().toString().slice(-6);
  const normalizedName = name
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9가-힣]/g, "")
    .slice(0, 8);
  const prefix = CATEGORY_PREFIX[category];

  return `${prefix}${normalizedName || "ITEM"}${digits}${index}`.slice(0, 20);
}
