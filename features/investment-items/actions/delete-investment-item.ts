"use server";

import { redirect } from "next/navigation";

import { deleteInvestmentItem } from "@/features/investment-items/services/investment-item-service";

export async function deleteInvestmentItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const portfolioId = String(formData.get("portfolioId") ?? "");

  if (!id) {
    redirect(`/items?status=item-invalid${portfolioId ? `&portfolio=${portfolioId}` : ""}`);
  }

  const result = await deleteInvestmentItem(id);

  if (!result.ok) {
    redirect(`/items?status=item-linked${portfolioId ? `&portfolio=${portfolioId}` : ""}`);
  }

  redirect(`/items?status=item-deleted${portfolioId ? `&portfolio=${portfolioId}` : ""}`);
}
