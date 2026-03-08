import { z } from "zod";

export const portfolioInputSchema = z.object({
  name: z.string().trim().min(1, "포트폴리오 이름을 입력하세요.").max(80),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((value) => value || ""),
  active: z.boolean().default(true),
});

export const portfolioUpdateSchema = portfolioInputSchema.extend({
  id: z.string().min(1),
});

export type PortfolioInput = z.infer<typeof portfolioInputSchema>;
export type PortfolioUpdateInput = z.infer<typeof portfolioUpdateSchema>;
