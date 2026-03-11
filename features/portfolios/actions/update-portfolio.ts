"use server";

import { redirect } from "next/navigation";

import { portfolioUpdateSchema } from "@/features/portfolios/schemas/portfolio";
import { updatePortfolio } from "@/features/portfolios/services/portfolio-service";
import { logger } from "@/lib/logger";

export async function updatePortfolioAction(formData: FormData) {
  const parsed = portfolioUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    logger.warn("portfolio.update.validation_failed", parsed.error.flatten());
    redirect("/portfolio-hub?status=portfolio-invalid");
  }

  await updatePortfolio(parsed.data);
  redirect(
    `/portfolio-hub?${new URLSearchParams({
      status: "portfolio-updated",
      portfolio: parsed.data.id,
    }).toString()}`,
  );
}
