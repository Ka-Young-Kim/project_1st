"use server";

import { redirect } from "next/navigation";

import { buildAccountReturnPath } from "@/features/portfolios/lib/account-return-path";
import { deletePortfolioAccount } from "@/features/portfolios/services/portfolio-management-service";

export async function deletePortfolioAccountAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "");

  if (!id || !portfolioId) {
    redirect(
      buildAccountReturnPath({
        fallbackPath: "/portfolios",
        returnTo,
        portfolioId,
        status: "portfolio-account-invalid",
      }),
    );
  }

  const result = await deletePortfolioAccount(id);

  if (!result.ok) {
    redirect(
      buildAccountReturnPath({
        fallbackPath: "/portfolios",
        returnTo,
        portfolioId,
        status: "portfolio-account-invalid",
      }),
    );
  }

  redirect(
    buildAccountReturnPath({
      fallbackPath: "/portfolios",
      returnTo,
      portfolioId,
      status: "portfolio-account-deleted",
    }),
  );
}
