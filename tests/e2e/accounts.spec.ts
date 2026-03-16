import { expect, test, type Page } from "@playwright/test";

import { login, uniqueSuffix } from "@/tests/e2e/helpers";

function navLink(page: Page, name: RegExp) {
  return page.locator("nav").first().getByRole("link", { name });
}

async function goToNavLink(page: Page, name: RegExp) {
  const href = await navLink(page, name).getAttribute("href");

  expect(href).toBeTruthy();
  await page.goto(href!);
}

test("hides portfolio composition CTA when no account is selected", async ({
  page,
}) => {
  await login(page);

  await goToNavLink(page, /계좌 관리 직접 등록과 불러오기/);
  await expect(page).toHaveURL(/\/accounts\?portfolio=/);
  await expect(page.getByRole("heading", { name: "계좌를 선택하세요" })).toBeVisible();
  await expect(page.getByRole("link", { name: "포트폴리오 구성 열기" })).toHaveCount(0);
});

test("manages accounts and gates journal creation until an account exists", async ({
  page,
}) => {
  const suffix = uniqueSuffix().slice(-6);
  const accountName = `테스트 계좌 ${suffix}`;
  const updatedAccountName = `업데이트 계좌 ${suffix}`;
  const itemName = `테스트 항목 ${suffix}`;
  const itemCode = `ACC${suffix.slice(-3)}`;

  await login(page);

  await goToNavLink(page, /계좌 관리 직접 등록과 불러오기/);
  await expect(page).toHaveURL(/\/accounts\?portfolio=/);
  await expect(page.getByText("등록된 계좌가 없습니다")).toBeVisible();

  await goToNavLink(page, /투자일지 매매 기록과 회고/);
  await expect(page).toHaveURL(/\/journal\?portfolio=/);
  await expect(
    page.getByRole("link", { name: "계좌 등록", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("새 투자일지 추가 열기")).toHaveCount(0);

  await goToNavLink(page, /계좌 관리 직접 등록과 불러오기/);
  await page.getByRole("button", { name: "계좌 추가" }).click();
  const createAccountForm = page.locator("form").filter({ hasText: "계좌 추가" }).last();
  await createAccountForm.getByLabel("이름").fill(accountName);
  await createAccountForm.getByLabel("은행").fill("테스트증권");
  await createAccountForm.getByLabel("계좌 번호").fill(`123-45-${suffix}`);
  await createAccountForm.getByRole("button", { name: "계좌 추가" }).click();

  await expect(page.getByRole("heading", { name: accountName })).toBeVisible();

  await page.getByRole("button", { name: accountName, exact: true }).click();
  const updateAccountForm = page.locator("form").filter({ hasText: "계좌 저장" }).last();
  await updateAccountForm.getByLabel("이름").fill(updatedAccountName);
  await updateAccountForm.getByLabel("은행").fill("리네임증권");
  await updateAccountForm.getByLabel("계좌 번호").fill(`999-88-${suffix}`);
  await updateAccountForm.getByRole("button", { name: "계좌 저장" }).click();

  await expect(page.getByRole("heading", { name: updatedAccountName })).toBeVisible();
  await expect(page.getByRole("button", { name: "계좌 삭제" })).toHaveText("×");

  await goToNavLink(page, /투자 항목 관리 수동 등록과 기본 정보/);
  await page.getByLabel("투자 항목 추가 열기").click();
  const createItemForm = page.locator("form").filter({ hasText: "항목 저장" }).last();
  await createItemForm.getByLabel("항목명").fill(itemName);
  await createItemForm.getByLabel("코드").fill(itemCode);
  await createItemForm.getByRole("button", { name: "항목 저장" }).click();

  await expect(page.getByRole("heading", { name: itemName })).toBeVisible();

  await goToNavLink(page, /투자일지 매매 기록과 회고/);
  await expect(page.getByLabel("새 투자일지 추가 열기")).toBeVisible();
  await page.getByLabel("새 투자일지 추가 열기").click();

  const createJournalForm = page.locator("form").filter({ hasText: "투자일지 저장" }).last();
  await createJournalForm.getByLabel("거래일").fill("2026-03-16");
  await createJournalForm.getByLabel("계좌").selectOption({ label: updatedAccountName });
  await createJournalForm
    .getByLabel("투자 항목")
    .selectOption({ label: `${itemName} (${itemCode})` });
  await createJournalForm.getByLabel("수량").fill("3");
  await createJournalForm.getByLabel("가격").fill("10000");
  await createJournalForm.getByLabel("매매 이유").fill("계좌 연결 흐름 확인");
  await createJournalForm.getByRole("button", { name: "투자일지 저장" }).click();

  await expect(
    page.getByRole("link", { name: new RegExp(updatedAccountName) }).first(),
  ).toBeVisible();

  await goToNavLink(page, /계좌 관리 직접 등록과 불러오기/);
  await page.getByRole("button", { name: "계좌 삭제" }).click();
  await page.getByRole("button", { name: "삭제", exact: true }).click();

  await expect(page.getByText("등록된 계좌가 없습니다")).toBeVisible();

  await goToNavLink(page, /투자일지 매매 기록과 회고/);
  await expect(
    page.getByRole("link", { name: "계좌 등록", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "계좌를 먼저 등록하세요" })).toBeVisible();

  await goToNavLink(page, /포트폴리오 구성 자산군과 목표 비중/);
  await expect(page.getByRole("heading", { name: "계좌 요약" })).toBeVisible();
  await expect(page.getByRole("link", { name: "계좌 관리로 이동" })).toBeVisible();
});
