"use server";

import { redirect } from "next/navigation";

import { portfolioInputSchema } from "@/features/portfolios/schemas/portfolio";
import { createPortfolio } from "@/features/portfolios/services/portfolio-service";
import { logger } from "@/lib/logger";

export async function createPortfolioAction(formData: FormData) {
  const parsed = portfolioInputSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    logger.warn("portfolio.create.validation_failed", parsed.error.flatten());
    redirect("/portfolio-hub?status=portfolio-invalid");
  }

  const portfolio = await createPortfolio(parsed.data);
  redirect(
    `/portfolio-hub?${new URLSearchParams({
      status: "portfolio-created",
      portfolio: portfolio.id,
    }).toString()}`,
  );
}
