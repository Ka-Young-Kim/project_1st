"use server";

import { redirect } from "next/navigation";

import { deleteJournalEntry } from "@/features/journal/services/journal-service";
import { logger } from "@/lib/logger";

export async function deleteJournal(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    logger.warn("journal.delete.validation_failed");
    redirect(buildJournalRedirectPath(formData, "journal-invalid"));
  }

  await deleteJournalEntry(id);
  redirect(buildJournalRedirectPath(formData, "journal-deleted"));
}

function buildJournalRedirectPath(formData: FormData, status: string) {
  const params = new URLSearchParams({ status });
  const portfolioId = getString(formData, "portfolioId");
  const month = getString(formData, "redirectMonth");
  const date = getString(formData, "redirectDate");

  if (portfolioId) {
    params.set("portfolio", portfolioId);
  }

  if (month) {
    params.set("month", month);
  }

  if (date) {
    params.set("date", date);
  }

  return `/journal?${params.toString()}`;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
