"use server";

import { redirect } from "next/navigation";

import { portfolioSnapshotInputSchema } from "@/features/portfolios/schemas/portfolio-management";
import { recordPortfolioSnapshot } from "@/features/portfolios/services/portfolio-management-service";
import { logger } from "@/lib/logger";

export async function recordPortfolioSnapshotAction(formData: FormData) {
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const parsed = portfolioSnapshotInputSchema.safeParse({
    portfolioId,
  });

  if (!parsed.success) {
    logger.warn("portfolio.snapshot.record.validation_failed", parsed.error.flatten());
    redirect(`/portfolios?status=portfolio-snapshot-invalid&portfolio=${portfolioId}`);
  }

  await recordPortfolioSnapshot(parsed.data.portfolioId);
  redirect(`/portfolios?status=portfolio-snapshot-recorded&portfolio=${portfolioId}`);
}
