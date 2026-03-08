"use server";

import { redirect } from "next/navigation";

import { investmentItemUpdateSchema } from "@/features/investment-items/schemas/investment-item";
import { updateInvestmentItem } from "@/features/investment-items/services/investment-item-service";
import { logger } from "@/lib/logger";

export async function updateInvestmentItemAction(formData: FormData) {
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const parsed = investmentItemUpdateSchema.safeParse({
    id: formData.get("id"),
    portfolioId,
    name: formData.get("name"),
    code: formData.get("code"),
    category: formData.get("category"),
    industry: formData.get("industry"),
    notes: formData.get("notes"),
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    logger.warn("investment_item.update.validation_failed", parsed.error.flatten());
    redirect(`/items?status=item-invalid${portfolioId ? `&portfolio=${portfolioId}` : ""}`);
  }

  await updateInvestmentItem(parsed.data);
  redirect(`/items?status=item-updated${portfolioId ? `&portfolio=${portfolioId}` : ""}`);
}
