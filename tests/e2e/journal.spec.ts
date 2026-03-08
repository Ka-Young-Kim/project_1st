import { expect, test } from "@playwright/test";

import { createJournal, login, uniqueSuffix } from "@/tests/e2e/helpers";

test("creates, updates, and deletes a journal entry", async ({ page }) => {
  const suffix = uniqueSuffix();
  const symbol = `AAPL${suffix.slice(-3)}`;
  const updatedSymbol = `TSLA${suffix.slice(-3)}`;

  await login(page);
  await createJournal(page, {
    tradeDate: "2026-03-08",
    symbol,
    action: "buy",
    quantity: "10",
    price: "123000",
    reason: "실적 회복과 현금흐름 개선 기대",
    review: "진입 분할 원칙 유지",
  });

  const item = page.locator("article").filter({ hasText: symbol }).first();
  await expect(item).toBeVisible();
  await expect(item).toContainText("buy");
  await expect(item).toContainText("실적 회복과 현금흐름 개선 기대");

  await item.locator("summary").click();
  await item.getByLabel("종목 코드").fill(updatedSymbol);
  await item.getByLabel("Sell").check();
  await item.getByLabel(/가격 \(KRW\)/).fill("127500");
  await item.getByLabel("회고").fill("목표 수익률 구간 일부 정리");
  await item.getByRole("button", { name: "수정 저장" }).click();

  const updatedItem = page.locator("article").filter({ hasText: updatedSymbol }).first();
  await expect(updatedItem).toBeVisible();
  await expect(updatedItem).toContainText("sell");
  await expect(updatedItem).toContainText("목표 수익률 구간 일부 정리");

  page.once("dialog", (dialog) => dialog.accept());
  await updatedItem.getByRole("button", { name: "삭제" }).click();

  await expect(page.locator("article").filter({ hasText: updatedSymbol })).toHaveCount(0);
});
