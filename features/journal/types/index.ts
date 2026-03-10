export type JournalListItem = {
  id: string;
  tradeDate: Date;
  investmentItemId: string | null;
  portfolioAccountId: string | null;
  portfolioAccountName: string | null;
  itemName: string | null;
  symbol: string;
  action: "buy" | "sell";
  quantity: string;
  price: string;
  reason: string;
  review: string | null;
  updatedAt: Date;
};
