import { revalidatePath } from "next/cache";

import {
  InvestmentItemInput,
  InvestmentItemUpdateInput,
} from "@/features/investment-items/schemas/investment-item";
import { prisma } from "@/lib/prisma";

export async function createInvestmentItem(input: InvestmentItemInput) {
  await prisma.investmentItem.create({
    data: {
      portfolioId: input.portfolioId,
      name: input.name,
      code: input.code,
      category: input.category || null,
      industry: input.industry || null,
      notes: input.notes || null,
      active: input.active,
    },
  });

  revalidatePath("/");
  revalidatePath("/items");
  revalidatePath("/journal");
}

export async function updateInvestmentItem(input: InvestmentItemUpdateInput) {
  await prisma.investmentItem.update({
    where: { id: input.id },
    data: {
      name: input.name,
      code: input.code,
      category: input.category || null,
      industry: input.industry || null,
      notes: input.notes || null,
      active: input.active,
    },
  });

  revalidatePath("/");
  revalidatePath("/items");
  revalidatePath("/journal");
}

export async function deleteInvestmentItem(id: string) {
  const linkedLogCount = await prisma.investmentLog.count({
    where: { investmentItemId: id },
  });

  if (linkedLogCount > 0) {
    return { ok: false as const, reason: "linked" };
  }

  await prisma.investmentItem.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/items");
  revalidatePath("/journal");

  return { ok: true as const };
}
