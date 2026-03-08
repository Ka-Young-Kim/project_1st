import { z } from "zod";

import { decimalInputSchema, seoulDateSchema } from "@/lib/validation";

export const journalInputSchema = z.object({
  tradeDate: seoulDateSchema,
  symbol: z
    .string()
    .trim()
    .min(1, "종목 코드를 입력하세요.")
    .max(20, "종목 코드는 20자 이하여야 합니다.")
    .transform((value) => value.toUpperCase()),
  action: z.enum(["buy", "sell"]),
  quantity: decimalInputSchema,
  price: decimalInputSchema,
  reason: z.string().trim().min(1, "투자 이유를 입력하세요.").max(2000),
  review: z.string().trim().max(2000).optional().transform((value) => value || ""),
});

export const journalUpdateSchema = journalInputSchema.extend({
  id: z.string().min(1),
});

export type JournalInput = z.infer<typeof journalInputSchema>;
export type JournalUpdateInput = z.infer<typeof journalUpdateSchema>;
