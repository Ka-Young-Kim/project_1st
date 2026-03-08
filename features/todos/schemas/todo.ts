import { z } from "zod";

import { optionalSeoulDateSchema } from "@/lib/validation";

export const todoInputSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력하세요.").max(120),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: optionalSeoulDateSchema,
  notes: z.string().trim().max(1000).optional().transform((value) => value || ""),
});

export const todoUpdateSchema = todoInputSchema.extend({
  id: z.string().min(1),
  completed: z.enum(["true", "false"]),
});

export type TodoInput = z.infer<typeof todoInputSchema>;
export type TodoUpdateInput = z.infer<typeof todoUpdateSchema>;
