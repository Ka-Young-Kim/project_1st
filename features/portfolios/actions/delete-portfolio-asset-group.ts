"use server";

import { redirect } from "next/navigation";

import { deletePortfolioAssetGroup } from "@/features/portfolios/services/portfolio-management-service";

export async function deletePortfolioAssetGroupAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const portfolioId = String(formData.get("portfolioId") ?? "");

  if (!id || !portfolioId) {
    redirect("/portfolios?status=portfolio-asset-group-invalid");
  }

  await deletePortfolioAssetGroup(id);
  redirect(`/portfolios?status=portfolio-asset-group-deleted&portfolio=${portfolioId}`);
}
