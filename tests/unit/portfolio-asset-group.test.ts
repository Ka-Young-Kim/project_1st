import { describe, expect, it } from "vitest";

import {
  RESIDUAL_ASSET_GROUP_NAME,
  isResidualAssetGroupName,
  reconcileAssetGroupWeights,
} from "@/features/portfolios/lib/asset-group";

describe("portfolio asset group weight rules", () => {
  it("fills the remainder into the residual asset group", () => {
    const result = reconcileAssetGroupWeights([
      { id: "a", name: "국내주식", targetWeight: 40, sortOrder: 0 },
      { id: "b", name: "채권", targetWeight: 30, sortOrder: 1 },
    ]);

    expect(result.regularTotal).toBe(70);
    expect(result.residualWeight).toBe(30);
    expect(result.shouldCreateResidualGroup).toBe(true);
  });

  it("keeps a residual asset group at zero when the regular groups already sum to 100", () => {
    const result = reconcileAssetGroupWeights([
      { id: "a", name: "국내주식", targetWeight: 60, sortOrder: 0 },
      { id: "b", name: "채권", targetWeight: 40, sortOrder: 1 },
      { id: "c", name: RESIDUAL_ASSET_GROUP_NAME, targetWeight: 10, sortOrder: 2 },
    ]);

    expect(result.regularTotal).toBe(100);
    expect(result.residualGroup?.id).toBe("c");
    expect(result.residualWeight).toBe(0);
    expect(result.shouldCreateResidualGroup).toBe(false);
  });

  it("rejects totals over 100 before residual reconciliation", () => {
    expect(() =>
      reconcileAssetGroupWeights([
        { id: "a", name: "국내주식", targetWeight: 70, sortOrder: 0 },
        { id: "b", name: "채권", targetWeight: 40, sortOrder: 1 },
      ]),
    ).toThrow("Asset group target weights exceed 100%.");
  });

  it("recognizes the residual asset group by normalized name", () => {
    expect(isResidualAssetGroupName("미지정")).toBe(true);
    expect(isResidualAssetGroupName("기타투자")).toBe(true);
    expect(isResidualAssetGroupName("국내주식")).toBe(false);
  });
});
