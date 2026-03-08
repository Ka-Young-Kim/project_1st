"use server";

import { redirect } from "next/navigation";

import { journalInputSchema } from "@/features/journal/schemas/journal";
import { createJournalEntry } from "@/features/journal/services/journal-service";
import { logger } from "@/lib/logger";

export async function createJournal(formData: FormData) {
  const parsed = journalInputSchema.safeParse({
    tradeDate: formData.get("tradeDate"),
    symbol: formData.get("symbol"),
    action: formData.get("action"),
    quantity: formData.get("quantity"),
    price: formData.get("price"),
    reason: formData.get("reason"),
    review: formData.get("review"),
  });

  if (!parsed.success) {
    logger.warn("journal.create.validation_failed", parsed.error.flatten());
    redirect("/journal?status=journal-invalid");
  }

  await createJournalEntry(parsed.data);
  redirect("/journal?status=journal-created");
}
