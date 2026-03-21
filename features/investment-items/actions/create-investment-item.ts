"use server";

import { redirect } from "next/navigation";

import { normalizeInvestmentItemCategory } from "@/features/investment-items/lib/category";
import { investmentItemInputSchema } from "@/features/investment-items/schemas/investment-item";
import {
  createInvestmentItem,
  DuplicateInvestmentItemError,
} from "@/features/investment-items/services/investment-item-service";
import { logger } from "@/lib/logger";

export async function createInvestmentItemAction(formData: FormData) {
  const portfolioId = getString(formData, "portfolioId");
  const redirectCategory = getString(formData, "redirectCategory");
  const parsed = investmentItemInputSchema.safeParse({
    portfolioId,
    name: formData.get("name"),
    code: formData.get("code"),
    quoteSymbol: getOptionalFormValue(formData, "quoteSymbol"),
    exchange: getOptionalFormValue(formData, "exchange"),
    currency: getOptionalFormValue(formData, "currency"),
    category: formData.get("category"),
    industry: getOptionalFormValue(formData, "industry"),
    active: formData.get("active") !== "off",
  });

  if (!parsed.success) {
    logger.warn(
      "investment_item.create.validation_failed",
      parsed.error.flatten(),
    );
    redirect(buildItemsRedirectPath(formData, "item-invalid"));
  }

  try {
    const item = await createInvestmentItem(parsed.data);
    const createdCategory = normalizeInvestmentItemCategory(
      parsed.data.category,
    );
    const nextCategory =
      redirectCategory &&
      redirectCategory !== "all" &&
      redirectCategory !== createdCategory
        ? createdCategory
        : redirectCategory;

    redirect(
      buildItemsRedirectPath(formData, "item-created", {
        category: nextCategory,
        itemId: item.id,
      }),
    );
  } catch (error) {
    if (error instanceof DuplicateInvestmentItemError) {
      const status =
        error.field === "code" ? "item-duplicate-code" : "item-duplicate-name";
      redirect(buildItemsRedirectPath(formData, status));
    }

    throw error;
  }
}

function getOptionalFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : undefined;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function buildItemsRedirectPath(
  formData: FormData,
  status: string,
  options?: {
    category?: string;
    itemId?: string;
    includeSelectedItem?: boolean;
  },
) {
  const params = new URLSearchParams({ status });
  const portfolioId = getString(formData, "portfolioId");
  const returnTo = getString(formData, "returnTo");
  const category = options?.category ?? getString(formData, "redirectCategory");
  const selectedItemId = options?.itemId ?? getString(formData, "redirectItem");
  const includeSelectedItem = options?.includeSelectedItem ?? true;

  if (returnTo && returnTo.startsWith("/")) {
    const url = new URL(returnTo, "http://localhost");

    if (portfolioId) {
      url.searchParams.set("portfolio", portfolioId);
    }

    url.searchParams.set("status", status);

    const search = url.searchParams.toString();
    return `${url.pathname}${search ? `?${search}` : ""}`;
  }

  if (portfolioId) {
    params.set("portfolio", portfolioId);
  }

  if (category && category !== "all") {
    params.set("category", category);
  }

  if (includeSelectedItem && selectedItemId) {
    params.set("item", selectedItemId);
  }

  return `/items?${params.toString()}`;
}
