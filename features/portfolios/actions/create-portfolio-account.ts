"use server";

import { redirect } from "next/navigation";

import { portfolioAccountInputSchema } from "@/features/portfolios/schemas/portfolio-management";
import { createPortfolioAccount } from "@/features/portfolios/services/portfolio-management-service";
import { logger } from "@/lib/logger";

export async function createPortfolioAccountAction(formData: FormData) {
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const parsed = portfolioAccountInputSchema.safeParse({
    portfolioId,
    name: formData.get("name"),
    bank: formData.get("bank"),
    displayId: formData.get("displayId"),
    sortOrder: formData.get("sortOrder"),
    cashTrackingEnabled: formData.get("cashTrackingEnabled") === "on",
    cashBalance: formData.get("cashBalance") ?? "0",
  });

  if (!parsed.success) {
    logger.warn("portfolio.account.create.validation_failed", parsed.error.flatten());
    redirect(`/portfolios?status=portfolio-account-invalid&portfolio=${portfolioId}`);
  }

  await createPortfolioAccount(parsed.data);
  redirect(`/portfolios?status=portfolio-account-created&portfolio=${portfolioId}`);
}
