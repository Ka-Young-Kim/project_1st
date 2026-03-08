"use server";

import { redirect } from "next/navigation";

import { deleteJournalEntry } from "@/features/journal/services/journal-service";
import { logger } from "@/lib/logger";

export async function deleteJournal(formData: FormData) {
  const id = formData.get("id");
  const portfolioId = String(formData.get("portfolioId") ?? "");

  if (typeof id !== "string" || !id) {
    logger.warn("journal.delete.validation_failed");
    redirect(`/journal?status=journal-invalid${portfolioId ? `&portfolio=${portfolioId}` : ""}`);
  }

  await deleteJournalEntry(id);
  redirect(`/journal?status=journal-deleted${portfolioId ? `&portfolio=${portfolioId}` : ""}`);
}
