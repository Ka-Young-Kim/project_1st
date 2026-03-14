import { z } from "zod";

import {
  INVESTMENT_ITEM_CATEGORIES,
  isCodeManagedCategory,
  normalizeInvestmentItemCategory,
  normalizeInvestmentItemIndustry,
} from "@/features/investment-items/lib/category";

const investmentItemBaseSchema = z.object({
  portfolioId: z.string().min(1, "포트폴리오를 선택하세요."),
  name: z.string().trim().min(1, "항목명을 입력하세요.").max(80),
  code: z
    .string()
    .trim()
    .max(20)
    .transform((value) => value.toUpperCase()),
  quoteSymbol: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((value) => value?.toUpperCase() || ""),
  exchange: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((value) => value?.toUpperCase() || ""),
  currency: z
    .string()
    .trim()
    .max(8)
    .optional()
    .transform((value) => value?.toUpperCase() || ""),
  category: z
    .enum(
      INVESTMENT_ITEM_CATEGORIES.map((item) => item.value) as [
        "stock",
        "etf",
        "bond",
        "other",
      ],
    )
    .default("other"),
  industry: z.string().trim().max(80).optional(),
  active: z.boolean().default(true),
});

const refinedInvestmentItemSchema = investmentItemBaseSchema.superRefine((data, ctx) => {
  const category = normalizeInvestmentItemCategory(data.category);
  const code = data.code.trim();

  if (isCodeManagedCategory(category) && !code) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["code"],
      message: "코드를 입력하세요.",
    });
  }
});

const transformInvestmentItem = <
  T extends {
    code: string;
    category: string;
    industry?: string;
  },
>(
  data: T,
) => {
  const category = normalizeInvestmentItemCategory(data.category);

  return {
    ...data,
    code: data.code.trim(),
    category,
    industry: normalizeInvestmentItemIndustry(category, data.industry),
  };
};

export const investmentItemInputSchema =
  refinedInvestmentItemSchema.transform(transformInvestmentItem);

export const investmentItemUpdateSchema = refinedInvestmentItemSchema
  .extend({
    id: z.string().min(1),
  })
  .transform(transformInvestmentItem);

export type InvestmentItemInput = z.infer<typeof investmentItemInputSchema>;
export type InvestmentItemUpdateInput = z.infer<typeof investmentItemUpdateSchema>;
