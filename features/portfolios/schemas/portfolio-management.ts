import { z } from "zod";

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
  name: z.string().trim().min(1, "은행 이름을 입력하세요.").max(80),
  nickname: z.string().trim().max(80).optional().transform((value) => value || ""),
  displayId: z.string().trim().min(1, "계좌 번호를 입력하세요.").max(80),
  sortOrder: z.coerce.number().int().min(0).default(0),
  cashTrackingEnabled: z.boolean().default(false),
  cashBalance: decimalOrZeroSchema.default("0"),
});

export const portfolioAccountUpdateSchema = portfolioAccountInputSchema.extend({
  id: z.string().min(1),
});

export const portfolioAssetGroupInputSchema = z.object({
  portfolioId: z.string().min(1, "포트폴리오를 선택하세요."),
  name: z.string().trim().min(1, "자산군을 입력하세요.").max(80),
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

export const portfolioItemInputSchema = z.object({
  portfolioId: z.string().min(1, "포트폴리오를 선택하세요."),
  linkedInvestmentItemId: z.string().trim().optional().transform((value) => value || ""),
  portfolioAccountId: z.string().trim().optional().transform((value) => value || ""),
  portfolioAssetGroupId: z.string().trim().optional().transform((value) => value || ""),
  name: z.string().trim().max(120).optional().transform((value) => value || ""),
  code: z.string().trim().max(40).optional().transform((value) => value || ""),
  quantity: decimalOrZeroSchema.default("0"),
  averagePrice: decimalOrZeroSchema.default("0"),
  currentPrice: decimalOrZeroSchema.default("0"),
  notes: z.string().trim().max(400).optional().transform((value) => value || ""),
  sortOrder: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const portfolioItemUpdateSchema = portfolioItemInputSchema.extend({
  id: z.string().min(1),
});

export type PortfolioAccountInput = z.infer<typeof portfolioAccountInputSchema>;
export type PortfolioAccountUpdateInput = z.infer<typeof portfolioAccountUpdateSchema>;
export type PortfolioAssetGroupInput = z.infer<typeof portfolioAssetGroupInputSchema>;
export type PortfolioAssetGroupUpdateInput = z.infer<typeof portfolioAssetGroupUpdateSchema>;
export type PortfolioHoldingAssignmentInput = z.infer<
  typeof portfolioHoldingAssignmentSchema
>;
export type PortfolioSnapshotInput = z.infer<typeof portfolioSnapshotInputSchema>;
export type PortfolioItemInput = z.infer<typeof portfolioItemInputSchema>;
export type PortfolioItemUpdateInput = z.infer<typeof portfolioItemUpdateSchema>;
