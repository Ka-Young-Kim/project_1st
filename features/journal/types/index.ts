export type JournalListItem = {
  id: string;
  tradeDate: Date;
  symbol: string;
  action: "buy" | "sell";
  quantity: string;
  price: string;
  reason: string;
  review: string | null;
  updatedAt: Date;
};
