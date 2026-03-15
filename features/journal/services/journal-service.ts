import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { JournalInput, JournalUpdateInput } from "@/features/journal/schemas/journal";
import { prisma } from "@/lib/prisma";

function toDecimal(value: string) {
  return new Prisma.Decimal(value);
}

export async function createJournalEntry(input: JournalInput) {
  const [item, account] = await Promise.all([
    prisma.investmentItem.findUnique({
      where: { id: input.investmentItemId },
    }),
    prisma.portfolioAccount.findUnique({
      where: { id: input.portfolioAccountId },
    }),
  ]);

  if (!item) {
    throw new Error(`Investment item not found: ${input.investmentItemId}`);
  }

  if (!account || account.portfolioId !== item.portfolioId) {
    throw new Error(`Portfolio account not found: ${input.portfolioAccountId}`);
  }

  const entry = await prisma.investmentLog.create({
    data: {
      tradeDate: new Date(`${input.tradeDate}T00:00:00+09:00`),
      investmentItemId: item.id,
      portfolioId: item.portfolioId,
      portfolioAccountId: account.id,
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

  return entry;
}

export async function updateJournalEntry(input: JournalUpdateInput) {
  const [item, account] = await Promise.all([
    prisma.investmentItem.findUnique({
      where: { id: input.investmentItemId },
    }),
    prisma.portfolioAccount.findUnique({
      where: { id: input.portfolioAccountId },
    }),
  ]);

  if (!item) {
    throw new Error(`Investment item not found: ${input.investmentItemId}`);
  }

  if (!account || account.portfolioId !== item.portfolioId) {
    throw new Error(`Portfolio account not found: ${input.portfolioAccountId}`);
  }

  await prisma.investmentLog.update({
    where: { id: input.id },
    data: {
      tradeDate: new Date(`${input.tradeDate}T00:00:00+09:00`),
      investmentItemId: item.id,
      portfolioId: item.portfolioId,
      portfolioAccountId: account.id,
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
