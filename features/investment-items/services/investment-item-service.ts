import { revalidatePath } from "next/cache";

import {
  InvestmentItemInput,
  InvestmentItemUpdateInput,
} from "@/features/investment-items/schemas/investment-item";
import { prisma } from "@/lib/prisma";

export class DuplicateInvestmentItemError extends Error {
  constructor(public readonly field: "name" | "code") {
    super(`Duplicate investment item ${field}`);
    this.name = "DuplicateInvestmentItemError";
  }
}

export async function createInvestmentItem(input: InvestmentItemInput) {
  const quoteSymbol = input.quoteSymbol || input.code;
  const exchange = input.exchange || inferExchangeFromCode(input.code);
  const currency = input.currency || inferCurrency(input.code, exchange);
  await assertInvestmentItemUnique({
    portfolioId: input.portfolioId,
    code: input.code,
    name: input.name,
  });

  await prisma.investmentItem.create({
    data: {
      portfolio: {
        connect: {
          id: input.portfolioId,
        },
      },
      name: input.name,
      code: input.code,
      quoteSymbol,
      exchange,
      currency,
      category: input.category || null,
      industry: input.industry || null,
      active: input.active,
    },
  });

  revalidatePath("/");
  revalidatePath("/items");
  revalidatePath("/journal");
}

export async function updateInvestmentItem(input: InvestmentItemUpdateInput) {
  const quoteSymbol = input.quoteSymbol || input.code;
  const exchange = input.exchange || inferExchangeFromCode(input.code);
  const currency = input.currency || inferCurrency(input.code, exchange);
  await assertInvestmentItemUnique({
    portfolioId: input.portfolioId,
    code: input.code,
    name: input.name,
    excludeId: input.id,
  });

  await prisma.investmentItem.update({
    where: { id: input.id },
    data: {
      portfolio: {
        connect: {
          id: input.portfolioId,
        },
      },
      name: input.name,
      code: input.code,
      quoteSymbol,
      exchange,
      currency,
      category: input.category || null,
      industry: input.industry || null,
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

function inferExchangeFromCode(code: string) {
  return /^\d{6}$/.test(code) ? "KRX" : null;
}

function inferCurrency(code: string, exchange: string | null) {
  if (exchange === "KRX" || /^\d{6}$/.test(code)) {
    return "KRW";
  }

  if (/^[A-Z]+$/.test(code)) {
    return "USD";
  }

  return null;
}

async function assertInvestmentItemUnique({
  portfolioId,
  code,
  name,
  excludeId,
}: {
  portfolioId: string;
  code: string;
  name: string;
  excludeId?: string;
}) {
  const existingByCode = await prisma.investmentItem.findFirst({
    where: {
      portfolioId,
      code,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });

  if (existingByCode) {
    throw new DuplicateInvestmentItemError("code");
  }

  const existingByName = await prisma.investmentItem.findFirst({
    where: {
      portfolioId,
      name,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });

  if (existingByName) {
    throw new DuplicateInvestmentItemError("name");
  }
}
