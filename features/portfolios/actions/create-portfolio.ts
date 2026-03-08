"use server";

import { redirect } from "next/navigation";

import { portfolioInputSchema } from "@/features/portfolios/schemas/portfolio";
import { createPortfolio } from "@/features/portfolios/services/portfolio-service";
import { logger } from "@/lib/logger";

export async function createPortfolioAction(formData: FormData) {
  const parsed = portfolioInputSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    logger.warn("portfolio.create.validation_failed", parsed.error.flatten());
    redirect("/portfolios?status=portfolio-invalid");
  }

  await createPortfolio(parsed.data);
  redirect("/portfolios?status=portfolio-created");
}
