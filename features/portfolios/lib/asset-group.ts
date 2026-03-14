export const PORTFOLIO_ASSET_GROUP_OPTIONS = [
  { value: "현금", label: "현금" },
  { value: "채권", label: "채권" },
  { value: "금", label: "금" },
  { value: "배당주", label: "배당주" },
  { value: "리츠", label: "리츠" },
  { value: "국내주식", label: "국내주식" },
  { value: "미국주식", label: "미국주식" },
  { value: "미지정", label: "미지정" },
] as const;

export const RESIDUAL_ASSET_GROUP_NAME = "미지정" as const;

export type PortfolioAssetGroupName =
  (typeof PORTFOLIO_ASSET_GROUP_OPTIONS)[number]["value"];

export function normalizePortfolioAssetGroupName(value?: string | null) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed === "기타투자") {
    return RESIDUAL_ASSET_GROUP_NAME;
  }

  return (
    PORTFOLIO_ASSET_GROUP_OPTIONS.find((item) => item.value === trimmed)?.value ?? ""
  );
}

export function isResidualAssetGroupName(value?: string | null) {
  return normalizePortfolioAssetGroupName(value) === RESIDUAL_ASSET_GROUP_NAME;
}

type AssetGroupWeightDraft = {
  id?: string;
  name: string;
  targetWeight: number;
  sortOrder: number;
};

export function reconcileAssetGroupWeights(groups: AssetGroupWeightDraft[]) {
  const regularGroups = groups.filter((group) => !isResidualAssetGroupName(group.name));
  const residualGroup = groups.find((group) => isResidualAssetGroupName(group.name)) ?? null;
  const regularTotal = regularGroups.reduce((sum, group) => sum + group.targetWeight, 0);

  if (regularTotal > 100.0001) {
    throw new Error("Asset group target weights exceed 100%.");
  }

  const residualWeight = Number(Math.max(0, 100 - regularTotal).toFixed(2));
  const maxSortOrder = groups.reduce(
    (max, group) => Math.max(max, group.sortOrder),
    -1,
  );

  return {
    regularGroups,
    residualGroup,
    regularTotal: Number(regularTotal.toFixed(2)),
    residualWeight,
    shouldCreateResidualGroup: !residualGroup && residualWeight > 0,
    residualSortOrder: maxSortOrder + 1,
  };
}
