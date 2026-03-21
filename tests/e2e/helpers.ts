import { expect, type Page } from "@playwright/test";

export async function login(page: Page) {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("비밀번호").fill("changeme1234");
  await page.getByRole("button", { name: "접속하기" }).click();

  await expect(page).toHaveURL(/\/($|\?)/, { timeout: 60000 });
}

export function uniqueSuffix() {
  return `${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

export async function createTodo(
  page: Page,
  input: {
    title: string;
    priority: "low" | "medium" | "high";
    dueDate: string;
    notes: string;
  },
) {
  await page.getByRole("link", { name: /할 일 관리/ }).click();
  await expect(page).toHaveURL(/\/todos$/);

  const form = page.locator("form").filter({ hasText: "TODO 저장" }).first();

  await form.getByLabel("제목").fill(input.title);
  await form.getByLabel("우선순위").selectOption(input.priority);
  await form.getByLabel("마감일").fill(input.dueDate);
  await form.getByLabel("메모").fill(input.notes);
  await form.getByRole("button", { name: "TODO 저장" }).click();

  await expect(page).toHaveURL(/status=todo-created/);
  await expect(page.getByText("새 TODO가 저장되었습니다.")).toBeVisible();
}

export async function createJournal(
  page: Page,
  input: {
    tradeDate: string;
    symbol: string;
    action: "buy" | "sell";
    quantity: string;
    price: string;
    reason: string;
    review: string;
  },
) {
  await page
    .locator("nav")
    .first()
    .getByRole("link", {
      name: "3 투자일지 매매 기록과 투자 이유, 회고를 남깁니다.",
    })
    .click();
  await expect(page).toHaveURL(/\/journal$/);

  const form = page
    .locator("form")
    .filter({ hasText: "투자일지 저장" })
    .first();

  await form.getByLabel("거래일").fill(input.tradeDate);
  await form.getByLabel("종목 코드").fill(input.symbol);
  await form.getByLabel(input.action === "buy" ? "매수" : "매도").check();
  await form.getByLabel("수량").fill(input.quantity);
  await form.getByLabel("가격").fill(input.price);
  await form.getByLabel("매매 이유").fill(input.reason);
  await form.getByLabel("회고").fill(input.review);
  await form.getByRole("button", { name: "투자일지 저장" }).click();

  await expect(page).toHaveURL(/status=journal-created/);
  await expect(page.getByText("투자일지가 저장되었습니다.")).toBeVisible();
}
