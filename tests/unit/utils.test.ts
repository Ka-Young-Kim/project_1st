import { describe, expect, it } from "vitest";

import { formatCurrency, formatDisplayDate } from "@/lib/utils";

describe("utils formatting", () => {
  it("formats Seoul dates deterministically", () => {
    expect(formatDisplayDate(new Date("2026-03-08T00:00:00+09:00"))).toBe(
      "2026.03.08",
    );
  });

  it("formats KRW values deterministically", () => {
    expect(formatCurrency("123000")).toBe("123,000원");
    expect(formatCurrency("123000.5")).toBe("123,000.5원");
  });
});
