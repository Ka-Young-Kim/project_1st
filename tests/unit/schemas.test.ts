import { describe, expect, it } from "vitest";

import { journalInputSchema } from "@/features/journal/schemas/journal";
import { todoInputSchema } from "@/features/todos/schemas/todo";

describe("schema validation", () => {
  it("accepts a valid todo payload", () => {
    const result = todoInputSchema.safeParse({
      title: "ISA 계좌 확인",
      priority: "high",
      dueDate: "2026-03-08",
      notes: "분기 리밸런싱 전 점검",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a non-positive journal quantity", () => {
    const result = journalInputSchema.safeParse({
      tradeDate: "2026-03-08",
      symbol: "005930",
      action: "buy",
      quantity: "0",
      price: "50000",
      reason: "실적 반등 기대",
      review: "",
    });

    expect(result.success).toBe(false);
  });
});
