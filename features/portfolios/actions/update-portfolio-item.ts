"use server";

import { redirect } from "next/navigation";

import { portfolioItemUpdateSchema } from "@/features/portfolios/schemas/portfolio-management";
import { updatePortfolioItem } from "@/features/portfolios/services/portfolio-management-service";
import { logger } from "@/lib/logger";

export async function updatePortfolioItemAction(formData: FormData) {
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const parsed = portfolioItemUpdateSchema.safeParse({
    id: formData.get("id"),
    portfolioId,
    linkedInvestmentItemId: formData.get("linkedInvestmentItemId"),
    portfolioAccountId: formData.get("portfolioAccountId"),
    portfolioAssetGroupId: formData.get("portfolioAssetGroupId"),
    name: formData.get("name"),
    code: formData.get("code"),
    quantity: formData.get("quantity"),
    averagePrice: formData.get("averagePrice"),
    currentPrice: formData.get("currentPrice"),
    notes: formData.get("notes"),
    sortOrder: formData.get("sortOrder"),
    active: formData.get("active") !== "off",
  });

  if (!parsed.success) {
    logger.warn("portfolio.item.update.validation_failed", parsed.error.flatten());
    redirect(`/portfolios?status=portfolio-item-invalid&portfolio=${portfolioId}`);
  }

  await updatePortfolioItem(parsed.data);
  redirect(`/portfolios?status=portfolio-item-updated&portfolio=${portfolioId}`);
}
