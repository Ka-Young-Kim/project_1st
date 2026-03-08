"use server";

import { redirect } from "next/navigation";

import { deleteInvestmentItem } from "@/features/investment-items/services/investment-item-service";

export async function deleteInvestmentItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/items?status=item-invalid");
  }

  const result = await deleteInvestmentItem(id);

  if (!result.ok) {
    redirect("/items?status=item-linked");
  }

  redirect("/items?status=item-deleted");
}
