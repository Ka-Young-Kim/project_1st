"use server";

import { redirect } from "next/navigation";

import { buildAccountReturnPath } from "@/features/portfolios/lib/account-return-path";
import { portfolioAccountInputSchema } from "@/features/portfolios/schemas/portfolio-management";
import { createPortfolioAccount } from "@/features/portfolios/services/portfolio-management-service";
import { logger } from "@/lib/logger";

export async function createPortfolioAccountAction(formData: FormData) {
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "");
  const parsed = portfolioAccountInputSchema.safeParse({
    portfolioId,
    name: formData.get("name"),
    bank: formData.get("bank"),
    displayId: formData.get("displayId"),
    sortOrder: formData.get("sortOrder"),
    cashTrackingEnabled: true,
    cashBalance: formData.get("cashBalance") ?? "0",
  });

  if (!parsed.success) {
    logger.warn("portfolio.account.create.validation_failed", parsed.error.flatten());
    redirect(
      buildAccountReturnPath({
        fallbackPath: "/portfolios",
        returnTo,
        portfolioId,
        status: "portfolio-account-invalid",
      }),
    );
  }

  await createPortfolioAccount(parsed.data);
  redirect(
    buildAccountReturnPath({
      fallbackPath: "/portfolios",
      returnTo,
      portfolioId,
      status: "portfolio-account-created",
    }),
  );
}
