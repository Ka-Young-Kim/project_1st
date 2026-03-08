"use server";

import { redirect } from "next/navigation";

import { deletePortfolio } from "@/features/portfolios/services/portfolio-service";

export async function deletePortfolioAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/portfolios?status=portfolio-invalid");
  }

  const result = await deletePortfolio(id);

  if (!result.ok) {
    redirect("/portfolios?status=portfolio-linked");
  }

  redirect("/portfolios?status=portfolio-deleted");
}
