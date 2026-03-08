import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { JournalInput, JournalUpdateInput } from "@/features/journal/schemas/journal";
import { prisma } from "@/lib/prisma";

function toDecimal(value: string) {
  return new Prisma.Decimal(value);
}

export async function createJournalEntry(input: JournalInput) {
  await prisma.investmentLog.create({
    data: {
      tradeDate: new Date(`${input.tradeDate}T00:00:00+09:00`),
      symbol: input.symbol,
      action: input.action,
      quantity: toDecimal(input.quantity),
      price: toDecimal(input.price),
      reason: input.reason,
      review: input.review || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/journal");
}

export async function updateJournalEntry(input: JournalUpdateInput) {
  await prisma.investmentLog.update({
    where: { id: input.id },
    data: {
      tradeDate: new Date(`${input.tradeDate}T00:00:00+09:00`),
      symbol: input.symbol,
      action: input.action,
      quantity: toDecimal(input.quantity),
      price: toDecimal(input.price),
      reason: input.reason,
      review: input.review || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/journal");
}

export async function deleteJournalEntry(id: string) {
  await prisma.investmentLog.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/journal");
}
