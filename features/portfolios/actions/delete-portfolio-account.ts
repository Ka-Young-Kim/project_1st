"use server";

import { redirect } from "next/navigation";

import { deletePortfolioAccount } from "@/features/portfolios/services/portfolio-management-service";

export async function deletePortfolioAccountAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const portfolioId = String(formData.get("portfolioId") ?? "");

  if (!id || !portfolioId) {
    redirect("/portfolios?status=portfolio-account-invalid");
  }

  const result = await deletePortfolioAccount(id);

  if (!result.ok) {
    redirect(`/portfolios?status=portfolio-account-invalid&portfolio=${portfolioId}`);
  }

  redirect(`/portfolios?status=portfolio-account-deleted&portfolio=${portfolioId}`);
}
