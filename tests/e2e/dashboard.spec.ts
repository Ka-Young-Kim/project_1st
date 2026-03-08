import { expect, test } from "@playwright/test";

import {
  createJournal,
  createTodo,
  login,
  uniqueSuffix,
} from "@/tests/e2e/helpers";

test("shows newly created todo and journal data on the dashboard", async ({
  page,
}) => {
  const suffix = uniqueSuffix();
  const todoTitle = `월간 현금흐름 점검 ${suffix}`;
  const journalSymbol = `NVDA${suffix.slice(-3)}`;

  await login(page);
  await createTodo(page, {
    title: todoTitle,
    priority: "high",
    dueDate: "2026-03-15",
    notes: "월말 입출금과 소비 패턴 정리",
  });
  await createJournal(page, {
    tradeDate: "2026-03-07",
    symbol: journalSymbol,
    action: "buy",
    quantity: "3",
    price: "980000",
    reason: "실적 모멘텀과 데이터센터 수요 반영",
    review: "분할 매수 계획 유지",
  });

  await page.getByRole("link", { name: /대시보드/ }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "오늘의 재무 루틴" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "다가오는 TODO" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "최근 투자일지" })).toBeVisible();

  const todoCard = page.locator("article").filter({ hasText: todoTitle }).first();
  await expect(todoCard).toBeVisible();
  await expect(todoCard).toContainText("high");

  const tradeCard = page.locator("article").filter({ hasText: journalSymbol }).first();
  await expect(tradeCard).toBeVisible();
  await expect(tradeCard).toContainText("buy");
  await expect(tradeCard).toContainText("실적 모멘텀과 데이터센터 수요 반영");
});
