import { expect, test } from "@playwright/test";

import { login, uniqueSuffix } from "@/tests/e2e/helpers";

test("shows the active portfolio workspace on the root page and scopes holdings by portfolio", async ({
  page,
}) => {
  const suffix = uniqueSuffix().slice(-6);
  const accountName = `포트 계좌 ${suffix}`;
  const itemName = `루트 항목 ${suffix}`;
  const itemCode = `ROOT${suffix.slice(-3)}`;
  const secondPortfolioName = `세컨드 포트폴리오 ${suffix}`;

  await login(page);

  const accountsHref = await page
    .locator("nav")
    .first()
    .getByRole("link", { name: /계좌 추가 직접 등록과 불러오기/ })
    .getAttribute("href");
  expect(accountsHref).toBeTruthy();
  await page.goto(accountsHref!);

  await page.getByRole("button", { name: "계좌 추가" }).click();
  const createAccountForm = page
    .locator("form")
    .filter({ hasText: "계좌 추가" })
    .last();
  await createAccountForm.getByLabel("이름").fill(accountName);
  await createAccountForm.getByLabel("은행").fill("루트증권");
  await createAccountForm.getByLabel("계좌 번호").fill(`000-11-${suffix}`);
  await createAccountForm.getByRole("button", { name: "계좌 추가" }).click();

  const itemsHref = await page
    .locator("nav")
    .first()
    .getByRole("link", { name: /투자 항목 관리 수동 등록과 기본 정보/ })
    .getAttribute("href");
  expect(itemsHref).toBeTruthy();
  await page.goto(itemsHref!);

  await page.getByLabel("투자 항목 추가 열기").click();
  const createItemForm = page
    .locator("form")
    .filter({ hasText: "항목 저장" })
    .last();
  await createItemForm.getByLabel("항목명").fill(itemName);
  await createItemForm.getByLabel("코드").fill(itemCode);
  await createItemForm.getByRole("button", { name: "항목 저장" }).click();

  const journalHref = await page
    .locator("nav")
    .first()
    .getByRole("link", { name: /투자일지 매매 기록과 회고/ })
    .getAttribute("href");
  expect(journalHref).toBeTruthy();
  await page.goto(journalHref!);

  await page.getByLabel("새 투자일지 추가 열기").click();
  const createJournalForm = page
    .locator("form")
    .filter({ hasText: "투자일지 저장" })
    .last();
  await createJournalForm.getByLabel("거래일").fill("2026-03-16");
  await createJournalForm
    .getByLabel("계좌")
    .selectOption({ label: accountName });
  await createJournalForm
    .getByLabel("투자 항목")
    .selectOption({ label: `${itemName} (${itemCode})` });
  await createJournalForm.getByLabel("수량").fill("3");
  await createJournalForm.getByLabel("가격").fill("10000");
  await createJournalForm
    .getByLabel("매매 이유")
    .fill("루트 포트폴리오 워크스페이스 확인");
  await createJournalForm
    .getByRole("button", { name: "투자일지 저장" })
    .click();

  await page.goto("/");
  await expect(
    page
      .locator("nav")
      .first()
      .getByRole("link", { name: /포트폴리오 구성/ }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "포트폴리오 상세" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "계좌 요약" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "보유항목" })).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "계좌 추가로 이동" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "계좌 추가", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "계좌 관리", exact: true }),
  ).toHaveCount(0);
  const portfolioItemRow = page
    .locator("button")
    .filter({ hasText: itemName })
    .first();
  await expect(portfolioItemRow).toBeVisible();
  await expect(portfolioItemRow).toContainText("매수단가");
  await expect(portfolioItemRow).toContainText("수량");
  await expect(portfolioItemRow).toContainText("투자금");
  await expect(portfolioItemRow).toContainText("현재가");
  await expect(portfolioItemRow).toContainText("평가금");
  await expect(portfolioItemRow).toContainText("수익률");
  await expect(portfolioItemRow).toContainText("3");
  await expect(portfolioItemRow).toContainText("10,000원");
  await expect(
    page.getByRole("heading", { name: "오늘의 재무 루틴" }),
  ).toHaveCount(0);

  await page.getByLabel("포트폴리오 허브").click();
  await expect(page).toHaveURL(/\/portfolio-hub\?portfolio=/);

  const createPortfolioForm = page
    .locator("form")
    .filter({ hasText: "포트폴리오 저장" })
    .last();
  await createPortfolioForm.getByLabel("이름").fill(secondPortfolioName);
  await createPortfolioForm.getByLabel("설명").fill("빈 포트폴리오 상태 확인");
  await createPortfolioForm
    .getByRole("button", { name: "포트폴리오 저장" })
    .click();

  await page.goto("/");
  await page
    .getByLabel("포트폴리오 선택")
    .selectOption({ label: secondPortfolioName });
  await expect(
    page.getByRole("heading", { name: "포트폴리오 상세" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "보유항목" })).toHaveCount(0);
  await expect(page.getByText(itemName)).toHaveCount(0);
});
