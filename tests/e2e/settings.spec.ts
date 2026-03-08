import { expect, test } from "@playwright/test";

import { login, uniqueSuffix } from "@/tests/e2e/helpers";

test("updates brand settings and monthly principle", async ({ page }) => {
  const suffix = uniqueSuffix();
  const brandName = `Kay Vault ${suffix.slice(-4)}`;
  const principle = `기록 우선 원칙 ${suffix}`;
  const insight = `직접 작성 인사이트 ${suffix}`;

  await login(page);
  await page.getByRole("button", { name: /재테크 Admin|Kay Vault|개인 투자 운영 보드|투자 관리 대시보드/ }).click();

  await page.getByLabel("브랜드 이름").fill(brandName);
  await page.getByLabel("보조 설명").fill("개인 투자 운영 보드");
  await page.getByLabel("이미지 URL 또는 내부 경로").fill("/globe.svg");
  await page.getByRole("button", { name: "설정 저장" }).click();

  await expect(page).toHaveURL(/status=settings-updated/);
  await expect(page.getByText("브랜드와 운영 설정이 저장되었습니다.")).toBeVisible();
  await expect(page.getByRole("heading", { name: brandName })).toBeVisible();
  await expect(page.getByText("개인 투자 운영 보드")).toBeVisible();
  await expect(page.getByAltText(`${brandName} 로고`)).toBeVisible();

  await page.getByRole("button", { name: /이번 달 원칙/ }).click();
  await page.getByLabel("이번 달 원칙").fill(principle);
  await page.getByRole("button", { name: "설정 저장" }).click();

  await expect(page).toHaveURL(/status=settings-updated/);
  await expect(page.locator("aside h4 + p")).toHaveText(principle);

  await page.getByRole("button", { name: /Insights/i }).click();
  await page.getByLabel("대시보드 인사이트").fill(
    `${insight}\n두 번째 문장 ${suffix}`,
  );
  await page.getByRole("button", { name: "설정 저장" }).click();

  await expect(page).toHaveURL(/status=settings-updated/);
  await expect(page.getByText(insight)).toBeVisible();
  await expect(page.getByText(`두 번째 문장 ${suffix}`)).toBeVisible();
});
