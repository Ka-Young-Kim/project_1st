"use server";

import { redirect } from "next/navigation";

import { deletePortfolioItem } from "@/features/portfolios/services/portfolio-management-service";

export async function deletePortfolioItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const portfolioId = String(formData.get("portfolioId") ?? "");

  if (!id || !portfolioId) {
    redirect("/portfolios?status=portfolio-item-invalid");
  }

  await deletePortfolioItem(id);
  redirect(`/portfolios?status=portfolio-item-deleted&portfolio=${portfolioId}`);
}
