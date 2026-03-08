import { z } from "zod";

export const seoulDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜 형식이 올바르지 않습니다.");

export const optionalSeoulDateSchema = z
  .union([seoulDateSchema, z.literal(""), z.null(), z.undefined()])
  .transform((value) =>
    typeof value === "string" && value.length > 0 ? value : undefined,
  );

export const decimalInputSchema = z
  .string()
  .trim()
  .refine((value) => /^(\d+)(\.\d+)?$/.test(value), "양수 숫자만 입력할 수 있습니다.")
  .refine((value) => Number(value) > 0, "0보다 커야 합니다.");
