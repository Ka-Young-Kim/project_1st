"use server";

import { redirect } from "next/navigation";

import { assignPortfolioHolding } from "@/features/portfolios/services/portfolio-management-service";
import { prisma } from "@/lib/prisma";

function normalizeHoldingRef(value: string) {
  return value.trim();
}

export async function bulkAssignPortfolioHoldingsAction(formData: FormData) {
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const portfolioAssetGroupId = String(formData.get("portfolioAssetGroupId") ?? "");
  const refs = formData
    .getAll("investmentItemRef")
    .map((value) => normalizeHoldingRef(String(value ?? "")))
    .filter(Boolean);

  if (!portfolioId || !portfolioAssetGroupId || refs.length === 0) {
    redirect(`/portfolios?status=portfolio-holding-invalid&portfolio=${portfolioId}`);
  }

  const items = await prisma.investmentItem.findMany({
    where: { portfolioId },
    select: {
      id: true,
      name: true,
      code: true,
    },
  });

  const refMap = new Map<string, string>();

  for (const item of items) {
    refMap.set(item.id, item.id);
    refMap.set(item.code, item.id);
    refMap.set(item.name, item.id);
    refMap.set(`${item.name} (${item.code})`, item.id);
  }

  const itemIds = refs.map((ref) => refMap.get(ref) ?? "");

  if (itemIds.some((itemId) => !itemId)) {
    redirect(`/portfolios?status=portfolio-holding-invalid&portfolio=${portfolioId}`);
  }

  for (const investmentItemId of [...new Set(itemIds)]) {
    await assignPortfolioHolding({
      portfolioId,
      investmentItemId,
      portfolioAssetGroupId,
    });
  }

  redirect(`/portfolios?status=portfolio-holding-linked&portfolio=${portfolioId}`);
}
