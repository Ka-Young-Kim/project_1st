import { expect, test } from "@playwright/test";

import { login, uniqueSuffix } from "@/tests/e2e/helpers";

test("creates account and item inline from the journal page before saving the first trade", async ({
  page,
}) => {
  const suffix = uniqueSuffix().slice(-6);
  const portfolioName = `저널 인라인 ${suffix}`;
  const accountName = `인라인 계좌 ${suffix}`;
  const itemName = `인라인 항목 ${suffix}`;
  const itemCode = `INL${suffix.slice(-3)}`;

  await login(page);
  await page.getByLabel("포트폴리오 허브").click();
  await expect(page).toHaveURL(/\/portfolio-hub(\?|$)/);

  const createPortfolioForm = page
    .locator("form")
    .filter({ hasText: "포트폴리오 저장" })
    .last();
  await createPortfolioForm.getByLabel("이름").fill(portfolioName);
  await createPortfolioForm
    .getByLabel("설명")
    .fill("투자일지 인라인 시작 흐름 확인");
  await createPortfolioForm
    .getByRole("button", { name: "포트폴리오 저장" })
    .click();

  await expect(page).toHaveURL(/\/portfolio-hub\?portfolio=/, {
    timeout: 15000,
  });
  await page
    .getByLabel("포트폴리오 선택")
    .selectOption({ label: portfolioName });
  const portfolioId = await page.getByLabel("포트폴리오 선택").inputValue();
  expect(portfolioId).toBeTruthy();

  await page.goto(`/journal?portfolio=${portfolioId}`);
  await expect(
    page.getByRole("heading", { name: "계좌 먼저 만들기" }),
  ).toBeVisible({ timeout: 15000 });

  const createAccountForm = page
    .locator("form")
    .filter({ hasText: "계좌 추가" })
    .first();
  await createAccountForm.getByLabel("이름").fill(accountName);
  await createAccountForm.getByLabel("은행").fill("인라인증권");
  await createAccountForm.getByLabel("계좌 번호").fill(`321-45-${suffix}`);
  await createAccountForm.getByRole("button", { name: "계좌 추가" }).click();

  await expect(
    page.getByRole("heading", { name: "투자 항목 먼저 만들기" }),
  ).toBeVisible({ timeout: 15000 });

  const createItemForm = page
    .locator("form")
    .filter({ hasText: "항목 추가" })
    .first();
  await createItemForm.getByLabel("항목명").fill(itemName);
  await createItemForm.getByLabel("분류").selectOption("stock");
  await createItemForm.getByLabel("코드").fill(itemCode);
  await createItemForm.getByRole("button", { name: "항목 추가" }).click();

  const createJournalForm = page
    .locator("form")
    .filter({ hasText: "투자일지 저장" })
    .first();
  await expect(
    page.getByRole("heading", { name: "새 투자일지 추가" }).first(),
  ).toBeVisible({ timeout: 15000 });
  await createJournalForm.getByLabel("거래일").fill("2026-03-17");
  await createJournalForm
    .getByLabel("계좌")
    .selectOption({ label: accountName });
  await createJournalForm
    .getByLabel("투자 항목")
    .selectOption({ label: `${itemName} (${itemCode})` });
  await createJournalForm.getByLabel("수량").fill("5");
  await createJournalForm.getByLabel("가격").fill("12000");
  await createJournalForm
    .getByLabel("매매 이유")
    .fill("인라인 초기 설정 흐름 확인");
  await createJournalForm
    .getByRole("button", { name: "투자일지 저장" })
    .click();

  await expect(page.getByText("투자일지가 저장되었습니다.")).toBeVisible();
  await expect(
    page.getByRole("link", { name: new RegExp(itemName) }).first(),
  ).toBeVisible();
});
