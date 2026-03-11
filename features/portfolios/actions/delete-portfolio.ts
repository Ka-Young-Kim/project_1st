"use server";

import { redirect } from "next/navigation";

import { deletePortfolio } from "@/features/portfolios/services/portfolio-service";

export async function deletePortfolioAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/portfolio-hub?status=portfolio-invalid");
  }

  const result = await deletePortfolio(id);

  if (!result.ok) {
    redirect(
      `/portfolio-hub?${new URLSearchParams({
        status: "portfolio-linked",
        portfolio: id,
      }).toString()}`,
    );
  }

  redirect("/portfolio-hub?status=portfolio-deleted");
}
