import { z } from "zod";

export const appSettingsSchema = z.object({
  brandName: z.string().trim().min(1, "브랜드 이름을 입력하세요.").max(40),
  brandSubtitle: z
    .string()
    .trim()
    .min(1, "보조 설명을 입력하세요.")
    .max(80),
  brandImageUrl: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((value) => value || ""),
  monthlyPrinciple: z
    .string()
    .trim()
    .min(1, "오늘의 원칙을 입력하세요.")
    .max(500),
  dashboardInsights: z
    .string()
    .trim()
    .min(1, "인사이트 문구를 입력하세요.")
    .max(1200),
});

export type AppSettingsInput = z.infer<typeof appSettingsSchema>;
