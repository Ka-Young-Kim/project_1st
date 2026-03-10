"use server";

import { redirect } from "next/navigation";

import { savePortfolioAssetGroupTargets } from "@/features/portfolios/services/portfolio-management-service";
import { logger } from "@/lib/logger";

export async function savePortfolioTargetsAction(formData: FormData) {
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const ids = formData.getAll("groupId").map((value) => String(value));
  const targetWeights = formData
    .getAll("targetWeight")
    .map((value) => String(value ?? ""));

  if (!portfolioId || ids.length !== targetWeights.length || ids.length === 0) {
    redirect(`/portfolios?status=portfolio-targets-invalid&portfolio=${portfolioId}`);
  }

  try {
    await savePortfolioAssetGroupTargets(
      portfolioId,
      ids.map((id, index) => ({
        id,
        targetWeight: targetWeights[index] ?? "0",
      })),
    );
  } catch (error) {
    logger.warn("portfolio.targets.update_failed", {
      portfolioId,
      error: error instanceof Error ? error.message : String(error),
    });
    redirect(`/portfolios?status=portfolio-targets-invalid&portfolio=${portfolioId}`);
  }

  redirect(`/portfolios?status=portfolio-targets-updated&portfolio=${portfolioId}`);
}
