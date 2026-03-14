"use server";

import { redirect } from "next/navigation";

import { portfolioAssetGroupInputSchema } from "@/features/portfolios/schemas/portfolio-management";
import { createPortfolioAssetGroup } from "@/features/portfolios/services/portfolio-management-service";
import { logger } from "@/lib/logger";

export async function createPortfolioAssetGroupAction(formData: FormData) {
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const parsed = portfolioAssetGroupInputSchema.safeParse({
    portfolioId,
    name: formData.get("name"),
    targetWeight: formData.get("targetWeight"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    logger.warn("portfolio.asset_group.create.validation_failed", parsed.error.flatten());
    redirect(`/portfolios?status=portfolio-asset-group-invalid&portfolio=${portfolioId}`);
  }

  try {
    await createPortfolioAssetGroup(parsed.data);
  } catch (error) {
    logger.warn("portfolio.asset_group.create_failed", {
      portfolioId,
      error: error instanceof Error ? error.message : String(error),
    });
    redirect(`/portfolios?status=portfolio-asset-group-invalid&portfolio=${portfolioId}`);
  }

  redirect(`/portfolios?status=portfolio-asset-group-created&portfolio=${portfolioId}`);
}
