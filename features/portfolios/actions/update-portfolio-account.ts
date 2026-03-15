"use server";

import { redirect } from "next/navigation";

import { portfolioAccountUpdateSchema } from "@/features/portfolios/schemas/portfolio-management";
import { updatePortfolioAccount } from "@/features/portfolios/services/portfolio-management-service";
import { logger } from "@/lib/logger";

export async function updatePortfolioAccountAction(formData: FormData) {
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const parsed = portfolioAccountUpdateSchema.safeParse({
    id: formData.get("id"),
    portfolioId,
    name: formData.get("name"),
    bank: formData.get("bank"),
    displayId: formData.get("displayId"),
    sortOrder: formData.get("sortOrder"),
    cashTrackingEnabled: formData.get("cashTrackingEnabled") === "on",
    cashBalance: formData.get("cashBalance") ?? "0",
  });

  if (!parsed.success) {
    logger.warn("portfolio.account.update.validation_failed", parsed.error.flatten());
    redirect(`/portfolios?status=portfolio-account-invalid&portfolio=${portfolioId}`);
  }

  await updatePortfolioAccount(parsed.data);
  redirect(`/portfolios?status=portfolio-account-updated&portfolio=${portfolioId}`);
}
