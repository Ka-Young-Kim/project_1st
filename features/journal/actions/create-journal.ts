"use server";

import { redirect } from "next/navigation";

import { journalInputSchema } from "@/features/journal/schemas/journal";
import { createJournalEntry } from "@/features/journal/services/journal-service";
import { logger } from "@/lib/logger";

export async function createJournal(formData: FormData) {
  const portfolioId = getString(formData, "portfolioId");
  const parsed = journalInputSchema.safeParse({
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
    logger.warn("journal.create.validation_failed", parsed.error.flatten());
    redirect(buildJournalRedirectPath(formData, "journal-invalid"));
  }

  const entry = await createJournalEntry(parsed.data);
  redirect(
    buildJournalRedirectPath(formData, "journal-created", {
      month: parsed.data.tradeDate.slice(0, 7),
      date: parsed.data.tradeDate,
      entryId: entry.id,
    }),
  );
}

function buildJournalRedirectPath(
  formData: FormData,
  status: string,
  options?: {
    month?: string;
    date?: string;
    entryId?: string;
    includeEntry?: boolean;
  },
) {
  const params = new URLSearchParams({ status });
  const portfolioId = getString(formData, "portfolioId");
  const month = options?.month ?? getString(formData, "redirectMonth");
  const date = options?.date ?? getString(formData, "redirectDate");
  const entryId = options?.entryId ?? getString(formData, "redirectEntry");
  const includeEntry = options?.includeEntry ?? true;

  if (portfolioId) {
    params.set("portfolio", portfolioId);
  }

  if (month) {
    params.set("month", month);
  }

  if (date) {
    params.set("date", date);
  }

  if (includeEntry && entryId) {
    params.set("entry", entryId);
  }

  return `/journal?${params.toString()}`;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
