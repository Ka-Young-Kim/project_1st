import { expect, test } from "@playwright/test";

import { login } from "@/tests/e2e/helpers";

test("redirects unauthenticated users to login and allows login", async ({
  page,
}) => {
  await login(page);
  await expect(page.getByRole("heading", { name: "오늘의 재무 루틴" })).toBeVisible();
});
