export const PORTFOLIO_ASSET_GROUP_OPTIONS = [
  { value: "채권", label: "채권" },
  { value: "금", label: "금" },
  { value: "배당주", label: "배당주" },
  { value: "리츠", label: "리츠" },
  { value: "국내주식", label: "국내주식" },
  { value: "미국주식", label: "미국주식" },
  { value: "기타투자", label: "기타투자" },
] as const;

export type PortfolioAssetGroupName =
  (typeof PORTFOLIO_ASSET_GROUP_OPTIONS)[number]["value"];

export function normalizePortfolioAssetGroupName(value?: string | null) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return "";
  }

  return (
    PORTFOLIO_ASSET_GROUP_OPTIONS.find((item) => item.value === trimmed)?.value ?? ""
  );
}
