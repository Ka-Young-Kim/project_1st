"use server";

import { redirect } from "next/navigation";

import { portfolioHoldingAssignmentSchema } from "@/features/portfolios/schemas/portfolio-management";
import {
  assignPortfolioHolding,
  unassignPortfolioHolding,
} from "@/features/portfolios/services/portfolio-management-service";
import { logger } from "@/lib/logger";

export async function updatePortfolioHoldingAction(formData: FormData) {
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const mode = String(formData.get("mode") ?? "assign");
  const investmentItemId = String(formData.get("investmentItemId") ?? "");

  if (mode === "unlink") {
    if (!portfolioId || !investmentItemId) {
      redirect("/portfolios?status=portfolio-holding-invalid");
    }

    await unassignPortfolioHolding(portfolioId, investmentItemId);
    redirect(`/portfolios?status=portfolio-holding-unlinked&portfolio=${portfolioId}`);
  }

  const parsed = portfolioHoldingAssignmentSchema.safeParse({
    portfolioId,
    investmentItemId,
    portfolioAssetGroupId: formData.get("portfolioAssetGroupId"),
  });

  if (!parsed.success) {
    logger.warn("portfolio.holding.update.validation_failed", parsed.error.flatten());
    redirect(`/portfolios?status=portfolio-holding-invalid&portfolio=${portfolioId}`);
  }

  await assignPortfolioHolding(parsed.data);
  redirect(`/portfolios?status=portfolio-holding-linked&portfolio=${portfolioId}`);
}
