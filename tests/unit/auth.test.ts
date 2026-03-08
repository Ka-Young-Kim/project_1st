import { beforeEach, describe, expect, it, vi } from "vitest";

describe("verifySessionToken", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("DATABASE_URL", "file:./prisma/dev.db");
    vi.stubEnv("APP_PASSWORD", "changeme1234");
    vi.stubEnv("SESSION_SECRET", "1234567890abcdef");
  });

  it("returns false for an invalid token", async () => {
    const { verifySessionToken } = await import("@/lib/auth");
    await expect(verifySessionToken("invalid-token")).resolves.toBe(false);
  });
});
