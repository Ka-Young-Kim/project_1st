"use server";

import { redirect } from "next/navigation";

import { portfolioAssetGroupUpdateSchema } from "@/features/portfolios/schemas/portfolio-management";
import { updatePortfolioAssetGroup } from "@/features/portfolios/services/portfolio-management-service";
import { logger } from "@/lib/logger";

export async function updatePortfolioAssetGroupAction(formData: FormData) {
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const parsed = portfolioAssetGroupUpdateSchema.safeParse({
    id: formData.get("id"),
    portfolioId,
    name: formData.get("name"),
    targetWeight: formData.get("targetWeight"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    logger.warn("portfolio.asset_group.update.validation_failed", parsed.error.flatten());
    redirect(`/portfolios?status=portfolio-asset-group-invalid&portfolio=${portfolioId}`);
  }

  await updatePortfolioAssetGroup(parsed.data);
  redirect(`/portfolios?status=portfolio-asset-group-updated&portfolio=${portfolioId}`);
}
