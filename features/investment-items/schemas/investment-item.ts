import { z } from "zod";

export const investmentItemInputSchema = z.object({
  name: z.string().trim().min(1, "항목명을 입력하세요.").max(80),
  code: z
    .string()
    .trim()
    .min(1, "코드를 입력하세요.")
    .max(20)
    .transform((value) => value.toUpperCase()),
  category: z.string().trim().max(40).optional().transform((value) => value || ""),
  industry: z.string().trim().max(80).optional().transform((value) => value || ""),
  notes: z.string().trim().max(2000).optional().transform((value) => value || ""),
  active: z.boolean().default(true),
});

export const investmentItemUpdateSchema = investmentItemInputSchema.extend({
  id: z.string().min(1),
});

export type InvestmentItemInput = z.infer<typeof investmentItemInputSchema>;
export type InvestmentItemUpdateInput = z.infer<typeof investmentItemUpdateSchema>;
