import { expect, test } from "@playwright/test";

import { createTodo, login, uniqueSuffix } from "@/tests/e2e/helpers";

test("creates, updates, completes, and deletes a todo", async ({ page }) => {
  const suffix = uniqueSuffix();
  const title = `ISA 리밸런싱 점검 ${suffix}`;
  const updatedTitle = `ISA 리밸런싱 완료 ${suffix}`;

  await login(page);
  await createTodo(page, {
    title,
    priority: "high",
    dueDate: "2026-03-12",
    notes: "분기별 자산 비중 재점검",
  });

  const item = page.locator("article").filter({ hasText: title }).first();
  await expect(item).toBeVisible();
  await expect(item).toContainText("high");
  await expect(item).toContainText("open");

  await item.locator("summary").click();
  await item.getByLabel("제목").fill(updatedTitle);
  await item.getByLabel("우선순위").selectOption("medium");
  await item.getByLabel("메모").fill("세제 혜택 계좌 구성 점검 완료");
  await item.getByRole("button", { name: "수정 저장" }).click();

  await expect(page).toHaveURL(/status=todo-updated/);
  const updatedItem = page.locator("article").filter({ hasText: updatedTitle }).first();
  await expect(updatedItem).toBeVisible();
  await expect(updatedItem).toContainText("medium");
  await expect(updatedItem).toContainText("세제 혜택 계좌 구성 점검 완료");

  await updatedItem.getByRole("button", { name: "완료 처리" }).click();
  await expect(page).toHaveURL(/status=todo-updated/);
  await expect(updatedItem).toContainText("done");

  page.once("dialog", (dialog) => dialog.accept());
  await updatedItem.getByRole("button", { name: "삭제" }).click();

  await expect(page).toHaveURL(/status=todo-deleted/);
  await expect(page.locator("article").filter({ hasText: updatedTitle })).toHaveCount(0);
});
