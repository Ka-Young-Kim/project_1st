"use server";

import { redirect } from "next/navigation";

import {
  createInvestmentItem,
  DuplicateInvestmentItemError,
} from "@/features/investment-items/services/investment-item-service";
import { buildInvestmentItemCode } from "@/features/investment-items/lib/internal-code";
import { createJournalEntry } from "@/features/journal/services/journal-service";
import { assignPortfolioHolding } from "@/features/portfolios/services/portfolio-management-service";
import { getTodayDateInputInSeoul } from "@/lib/utils";

function getCategoryByGroupName(groupName: string) {
  if (groupName === "채권") {
    return {
      category: "bond" as const,
      industry: "기타",
      currency: "KRW",
      exchange: "",
    };
  }

  return {
    category: "other" as const,
    industry: groupName,
    currency: "KRW",
    exchange: "",
  };
}

export async function createManualPortfolioHoldingsAction(formData: FormData) {
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const portfolioAssetGroupId = String(formData.get("portfolioAssetGroupId") ?? "");
  const groupName = String(formData.get("groupName") ?? "");
  const names = formData.getAll("manualName").map((value) => String(value ?? "").trim());
  const codes = formData.getAll("manualCode").map((value) => String(value ?? "").trim());
  const quantities = formData.getAll("manualQuantity").map((value) => String(value ?? "").trim());
  const prices = formData.getAll("manualPrice").map((value) => String(value ?? "").trim());
  const accountIds = formData
    .getAll("manualPortfolioAccountId")
    .map((value) => String(value ?? "").trim());

  if (
    !portfolioId ||
    !portfolioAssetGroupId ||
    !groupName ||
    names.length === 0 ||
    names.length !== quantities.length ||
    names.length !== prices.length ||
    names.length !== accountIds.length
  ) {
    redirect(`/portfolios?status=portfolio-holding-invalid&portfolio=${portfolioId}`);
  }

  const rows = names
    .map((name, index) => ({
      name,
      code: codes[index] ?? "",
      quantity: quantities[index] ?? "",
      price: prices[index] ?? "",
      portfolioAccountId: accountIds[index] ?? "",
    }))
    .filter((row) => row.name && row.quantity && row.price && row.portfolioAccountId);

  if (rows.length === 0) {
    redirect(`/portfolios?status=portfolio-holding-invalid&portfolio=${portfolioId}`);
  }

  const base = getCategoryByGroupName(groupName);
  const tradeDate = getTodayDateInputInSeoul();

  try {
    for (const [index, row] of rows.entries()) {
      const item = await createInvestmentItem({
        portfolioId,
        name: row.name,
        code: buildInvestmentItemCode({
          name: row.name,
          category: base.category,
          providedCode: row.code,
          index,
        }),
        quoteSymbol: "",
        exchange: base.exchange,
        currency: base.currency,
        category: base.category,
        industry: base.industry,
        active: true,
      });

      await createJournalEntry({
        tradeDate,
        portfolioAccountId: row.portfolioAccountId,
        investmentItemId: item.id,
        action: "buy",
        quantity: row.quantity,
        price: row.price,
        reason: `${groupName} 자산군 직접 입력`,
        review: "",
      });

      await assignPortfolioHolding({
        portfolioId,
        investmentItemId: item.id,
        portfolioAssetGroupId,
      });
    }
  } catch (error) {
    if (error instanceof DuplicateInvestmentItemError) {
      const status =
        error.field === "code" ? "item-duplicate-code" : "item-duplicate-name";
      redirect(`/portfolios?status=${status}&portfolio=${portfolioId}`);
    }

    redirect(`/portfolios?status=portfolio-holding-invalid&portfolio=${portfolioId}`);
  }

  redirect(`/portfolios?status=portfolio-holding-linked&portfolio=${portfolioId}`);
}
