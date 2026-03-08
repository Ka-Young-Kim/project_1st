"use server";

import { redirect } from "next/navigation";

import { investmentItemInputSchema } from "@/features/investment-items/schemas/investment-item";
import { createInvestmentItem } from "@/features/investment-items/services/investment-item-service";
import { logger } from "@/lib/logger";

export async function createInvestmentItemAction(formData: FormData) {
  const parsed = investmentItemInputSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    category: formData.get("category"),
    industry: formData.get("industry"),
    notes: formData.get("notes"),
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    logger.warn("investment_item.create.validation_failed", parsed.error.flatten());
    redirect("/items?status=item-invalid");
  }

  await createInvestmentItem(parsed.data);
  redirect("/items?status=item-created");
}
