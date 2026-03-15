import { z } from "zod";

import { optionalSeoulDateSchema } from "@/lib/validation";
import { getTodayDateInputInSeoul } from "@/lib/utils";

const todoBaseSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력하세요.").max(120),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: optionalSeoulDateSchema,
  notes: z.string().trim().max(1000).optional().transform((value) => value || ""),
});

export const todoInputSchema = todoBaseSchema.superRefine((input, ctx) => {
  if (!input.dueDate) {
    return;
  }

  if (input.dueDate < getTodayDateInputInSeoul()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["dueDate"],
      message: "지난 날짜는 마감일로 입력할 수 없습니다.",
    });
  }
});

export const todoUpdateSchema = todoBaseSchema.extend({
  id: z.string().min(1),
  completed: z.enum(["true", "false"]),
});

export type TodoInput = z.infer<typeof todoInputSchema>;
export type TodoUpdateInput = z.infer<typeof todoUpdateSchema>;
