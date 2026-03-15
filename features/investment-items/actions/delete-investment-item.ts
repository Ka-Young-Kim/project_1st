"use server";

import { redirect } from "next/navigation";

import { deleteInvestmentItem } from "@/features/investment-items/services/investment-item-service";

export async function deleteInvestmentItemAction(formData: FormData) {
  const id = getString(formData, "id");

  if (!id) {
    redirect(buildItemsRedirectPath(formData, "item-invalid", true));
  }

  const result = await deleteInvestmentItem(id);

  if (!result.ok) {
    redirect(buildItemsRedirectPath(formData, "item-linked", true));
  }

  redirect(buildItemsRedirectPath(formData, "item-deleted"));
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function buildItemsRedirectPath(
  formData: FormData,
  status: string,
  includeSelectedItem = false,
) {
  const params = new URLSearchParams({ status });
  const portfolioId = getString(formData, "portfolioId");
  const category = getString(formData, "redirectCategory");
  const selectedItemId = getString(formData, "redirectItem");

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
