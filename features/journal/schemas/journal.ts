import { z } from "zod";

import { decimalInputSchema, seoulDateSchema } from "@/lib/validation";

export const journalInputSchema = z.object({
  tradeDate: seoulDateSchema,
  portfolioAccountId: z.string().trim().min(1, "계좌를 선택하세요."),
  investmentItemId: z.string().trim().min(1, "투자 항목을 선택하세요."),
  action: z.enum(["buy", "sell"]),
  quantity: decimalInputSchema,
  price: decimalInputSchema,
  reason: z.string().trim().min(1, "매매 이유를 입력하세요.").max(2000),
  review: z.string().trim().max(2000).optional().transform((value) => value || ""),
});

export const journalUpdateSchema = journalInputSchema.extend({
  id: z.string().min(1),
});

export type JournalInput = z.infer<typeof journalInputSchema>;
export type JournalUpdateInput = z.infer<typeof journalUpdateSchema>;
