"use server";

import { redirect } from "next/navigation";

import { investmentItemUpdateSchema } from "@/features/investment-items/schemas/investment-item";
import {
  DuplicateInvestmentItemError,
  updateInvestmentItem,
} from "@/features/investment-items/services/investment-item-service";
import { logger } from "@/lib/logger";

export async function updateInvestmentItemAction(formData: FormData) {
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const parsed = investmentItemUpdateSchema.safeParse({
    id: formData.get("id"),
    portfolioId,
    name: formData.get("name"),
    code: formData.get("code"),
    quoteSymbol: getOptionalFormValue(formData, "quoteSymbol"),
    exchange: getOptionalFormValue(formData, "exchange"),
    currency: getOptionalFormValue(formData, "currency"),
    category: formData.get("category"),
    industry: formData.get("industry"),
    active: formData.get("active") !== "off",
  });

  if (!parsed.success) {
    logger.warn("investment_item.update.validation_failed", parsed.error.flatten());
    redirect(`/items?status=item-invalid${portfolioId ? `&portfolio=${portfolioId}` : ""}`);
  }

  try {
    await updateInvestmentItem(parsed.data);
  } catch (error) {
    if (error instanceof DuplicateInvestmentItemError) {
      const status =
        error.field === "code" ? "item-duplicate-code" : "item-duplicate-name";
      redirect(`/items?status=${status}${portfolioId ? `&portfolio=${portfolioId}` : ""}`);
    }

    throw error;
  }

  redirect(`/items?status=item-updated${portfolioId ? `&portfolio=${portfolioId}` : ""}`);
}

function getOptionalFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : undefined;
}
