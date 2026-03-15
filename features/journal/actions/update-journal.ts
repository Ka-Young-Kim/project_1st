"use server";

import { redirect } from "next/navigation";

import { journalUpdateSchema } from "@/features/journal/schemas/journal";
import { updateJournalEntry } from "@/features/journal/services/journal-service";
import { logger } from "@/lib/logger";

export async function updateJournal(formData: FormData) {
  const parsed = journalUpdateSchema.safeParse({
    id: formData.get("id"),
    tradeDate: formData.get("tradeDate"),
    portfolioAccountId: formData.get("portfolioAccountId"),
    investmentItemId: formData.get("investmentItemId"),
    action: formData.get("action"),
    quantity: formData.get("quantity"),
    price: formData.get("price"),
    reason: formData.get("reason"),
    review: formData.get("review"),
  });

  if (!parsed.success) {
    logger.warn("journal.update.validation_failed", parsed.error.flatten());
    redirect(buildJournalRedirectPath(formData, "journal-invalid"));
  }

  await updateJournalEntry(parsed.data);
  redirect(buildJournalRedirectPath(formData, "journal-updated"));
}

function buildJournalRedirectPath(formData: FormData, status: string) {
  const params = new URLSearchParams({ status });
  const portfolioId = getString(formData, "portfolioId");
  const month = getString(formData, "redirectMonth");
  const date = getString(formData, "redirectDate");
  const entryId = getString(formData, "redirectEntry");

  if (portfolioId) {
    params.set("portfolio", portfolioId);
  }

  if (month) {
    params.set("month", month);
  }

  if (date) {
    params.set("date", date);
  }

  if (entryId) {
    params.set("entry", entryId);
  }

  return `/journal?${params.toString()}`;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
