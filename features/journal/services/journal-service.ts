import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { JournalInput, JournalUpdateInput } from "@/features/journal/schemas/journal";
import { prisma } from "@/lib/prisma";

function toDecimal(value: string) {
  return new Prisma.Decimal(value);
}

export async function createJournalEntry(input: JournalInput) {
  const item = await prisma.investmentItem.findUnique({
    where: { id: input.investmentItemId },
  });

  if (!item) {
    throw new Error(`Investment item not found: ${input.investmentItemId}`);
  }

  await prisma.investmentLog.create({
    data: {
      tradeDate: new Date(`${input.tradeDate}T00:00:00+09:00`),
      investmentItemId: item.id,
      symbol: item.code,
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
  const item = await prisma.investmentItem.findUnique({
    where: { id: input.investmentItemId },
  });

  if (!item) {
    throw new Error(`Investment item not found: ${input.investmentItemId}`);
  }

  await prisma.investmentLog.update({
    where: { id: input.id },
    data: {
      tradeDate: new Date(`${input.tradeDate}T00:00:00+09:00`),
      investmentItemId: item.id,
      symbol: item.code,
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
