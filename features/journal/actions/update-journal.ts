"use server";

import { redirect } from "next/navigation";

import { journalUpdateSchema } from "@/features/journal/schemas/journal";
import { updateJournalEntry } from "@/features/journal/services/journal-service";
import { logger } from "@/lib/logger";

export async function updateJournal(formData: FormData) {
  const parsed = journalUpdateSchema.safeParse({
    id: formData.get("id"),
    tradeDate: formData.get("tradeDate"),
    symbol: formData.get("symbol"),
    action: formData.get("action"),
    quantity: formData.get("quantity"),
    price: formData.get("price"),
    reason: formData.get("reason"),
    review: formData.get("review"),
  });

  if (!parsed.success) {
    logger.warn("journal.update.validation_failed", parsed.error.flatten());
    redirect("/journal?status=journal-invalid");
  }

  await updateJournalEntry(parsed.data);
  redirect("/journal?status=journal-updated");
}
