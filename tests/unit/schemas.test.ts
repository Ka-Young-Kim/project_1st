import { describe, expect, it } from "vitest";

import { investmentItemInputSchema } from "@/features/investment-items/schemas/investment-item";
import { journalInputSchema } from "@/features/journal/schemas/journal";
import { todoInputSchema } from "@/features/todos/schemas/todo";

describe("schema validation", () => {
  it("accepts a valid todo payload", () => {
    const result = todoInputSchema.safeParse({
      title: "ISA 계좌 확인",
      priority: "high",
      dueDate: "2099-03-08",
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

  it("allows non-stock items without a user code", () => {
    const result = investmentItemInputSchema.safeParse({
      portfolioId: "portfolio-1",
      name: "기타 자산",
      code: "",
      quoteSymbol: "",
      exchange: "",
      currency: "",
      category: "other",
      industry: "",
      active: true,
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.category).toBe("other");
      expect(result.data.code).toBe("");
      expect(result.data.industry).toBe("");
    }
  });

  it("still requires a code for stock items", () => {
    const result = investmentItemInputSchema.safeParse({
      portfolioId: "portfolio-1",
      name: "삼성전자",
      code: "",
      quoteSymbol: "",
      exchange: "",
      currency: "",
      category: "stock",
      industry: "반도체",
      active: true,
    });

    expect(result.success).toBe(false);
  });
});
