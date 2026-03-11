import { z } from "zod";

import { PORTFOLIO_ASSET_GROUP_OPTIONS } from "@/features/portfolios/lib/asset-group";

const percentInputSchema = z
  .string()
  .trim()
  .refine((value) => /^(\d+)(\.\d+)?$/.test(value), "숫자만 입력할 수 있습니다.")
  .refine((value) => Number(value) >= 0, "0 이상이어야 합니다.")
  .refine((value) => Number(value) <= 100, "100 이하로 입력하세요.");

const decimalOrZeroSchema = z
  .string()
  .trim()
  .refine((value) => /^(\d+)(\.\d+)?$/.test(value), "숫자만 입력할 수 있습니다.");

export const portfolioAccountInputSchema = z.object({
  portfolioId: z.string().min(1, "포트폴리오를 선택하세요."),
  name: z.string().trim().min(1, "계좌 이름을 입력하세요.").max(80),
  displayId: z.string().trim().max(80).optional().transform((value) => value || ""),
  sortOrder: z.coerce.number().int().min(0).default(0),
  cashTrackingEnabled: z.boolean().default(false),
  cashBalance: decimalOrZeroSchema.default("0"),
});

export const portfolioAccountUpdateSchema = portfolioAccountInputSchema.extend({
  id: z.string().min(1),
});

export const portfolioAssetGroupInputSchema = z.object({
  portfolioId: z.string().min(1, "포트폴리오를 선택하세요."),
  name: z.enum(
    PORTFOLIO_ASSET_GROUP_OPTIONS.map((item) => item.value) as [
      "채권",
      "금",
      "배당주",
      "리츠",
      "국내주식",
      "미국주식",
      "기타투자",
    ],
  ),
  targetWeight: percentInputSchema,
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const portfolioAssetGroupUpdateSchema = portfolioAssetGroupInputSchema.extend({
  id: z.string().min(1),
});

export const portfolioHoldingAssignmentSchema = z.object({
  portfolioId: z.string().min(1),
  investmentItemId: z.string().min(1),
  portfolioAssetGroupId: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || ""),
});

export const portfolioSnapshotInputSchema = z.object({
  portfolioId: z.string().min(1),
});

export type PortfolioAccountInput = z.infer<typeof portfolioAccountInputSchema>;
export type PortfolioAccountUpdateInput = z.infer<typeof portfolioAccountUpdateSchema>;
export type PortfolioAssetGroupInput = z.infer<typeof portfolioAssetGroupInputSchema>;
export type PortfolioAssetGroupUpdateInput = z.infer<typeof portfolioAssetGroupUpdateSchema>;
export type PortfolioHoldingAssignmentInput = z.infer<
  typeof portfolioHoldingAssignmentSchema
>;
export type PortfolioSnapshotInput = z.infer<typeof portfolioSnapshotInputSchema>;
