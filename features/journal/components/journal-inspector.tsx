import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import {
  InvestmentItemCategory,
  isCodeManagedCategory,
} from "@/features/investment-items/lib/category";
import { deleteJournal } from "@/features/journal/actions/delete-journal";
import { JournalForm } from "@/features/journal/components/journal-form";
import { TradeActionToggle } from "@/features/journal/components/trade-action-toggle";
import { updateJournal } from "@/features/journal/actions/update-journal";
import { JournalListItem } from "@/features/journal/types";
import { formatDateInput, formatTradeActionLabel } from "@/lib/utils";

export function JournalInspector({
  entry,
  items,
  accounts,
  portfolioId,
  currentMonth,
  selectedDate,
}: Readonly<{
  entry?: JournalListItem;
  items: Array<{
    id: string;
    name: string;
    code: string;
    category: InvestmentItemCategory;
  }>;
  accounts: Array<{
    id: string;
    name: string;
    bank: string;
    displayId: string;
  }>;
  portfolioId: string;
  currentMonth: string;
  selectedDate?: string;
}>) {
  if (accounts.length === 0) {
    return (
      <div className="sticky top-5">
        <JournalForm
          items={items}
          accounts={accounts}
          portfolioId={portfolioId}
          redirectMonth={currentMonth}
          redirectDate={selectedDate}
        />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="sticky top-5">
        <JournalForm
          items={items}
          accounts={accounts}
          portfolioId={portfolioId}
          redirectMonth={currentMonth}
          redirectDate={selectedDate}
        />
      </div>
    );
  }

  return (
    <Card className="sticky top-5 border-white/8 bg-[linear-gradient(180deg,rgba(18,28,52,.98),rgba(14,22,42,.98))] p-5 text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            Inspector
          </p>
          <h2 className="mt-3 text-[1.2rem] font-semibold tracking-tight">
            {entry.itemName ?? entry.symbol}
          </h2>
          <p className="mt-2 text-[12px] text-[#9fb4d8]">
            {formatDateInput(entry.tradeDate)} · {entry.quantity}주 ·{" "}
            {entry.price}
          </p>
        </div>
        <Badge tone={entry.action} compact>
          {formatTradeActionLabel(entry.action)}
        </Badge>
      </div>

      <form action={updateJournal} className="mt-5 space-y-4">
        <input type="hidden" name="id" value={entry.id} />
        <input type="hidden" name="portfolioId" value={portfolioId} />
        <input type="hidden" name="redirectMonth" value={currentMonth} />
        <input type="hidden" name="redirectDate" value={selectedDate ?? ""} />
        <input type="hidden" name="redirectEntry" value={entry.id} />

        <div className="space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-medium">거래일</span>
            <Input
              name="tradeDate"
              type="date"
              defaultValue={formatDateInput(entry.tradeDate)}
              required
              tone="dark"
              className="py-2"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium">계좌</span>
              <Select
                name="portfolioAccountId"
                required
                defaultValue={entry.portfolioAccountId ?? accounts[0]?.id ?? ""}
                tone="dark"
                className="py-2.5"
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">종목</span>
              <Select
                name="investmentItemId"
                required
                defaultValue={entry.investmentItemId ?? ""}
                tone="dark"
                className="py-2.5"
              >
                <option value="">종목 선택</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {isCodeManagedCategory(item.category)
                      ? `${item.name} (${item.code})`
                      : item.name}
                  </option>
                ))}
              </Select>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-medium">매매 유형</span>
            <TradeActionToggle name="action" defaultValue={entry.action} />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium">수량</span>
              <Input
                name="quantity"
                type="number"
                step="0.0001"
                min="0.0001"
                defaultValue={entry.quantity}
                required
                tone="dark"
                className="py-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">가격</span>
              <Input
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                defaultValue={entry.price}
                required
                tone="dark"
                className="py-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </label>
          </div>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium">매매 이유</span>
          <Textarea
            name="reason"
            defaultValue={entry.reason}
            required
            tone="dark"
            className="min-h-24 py-2.5"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">회고</span>
          <Textarea
            name="review"
            defaultValue={entry.review ?? ""}
            tone="dark"
            className="min-h-24 py-2.5"
          />
        </label>

        <SubmitButton className="w-full" pendingLabel="수정 저장 중...">
          수정 저장
        </SubmitButton>
      </form>

      <form action={deleteJournal} className="mt-3">
        <input type="hidden" name="id" value={entry.id} />
        <input type="hidden" name="portfolioId" value={portfolioId} />
        <input type="hidden" name="redirectMonth" value={currentMonth} />
        <input type="hidden" name="redirectDate" value={selectedDate ?? ""} />
        <ConfirmSubmitButton
          confirmMessage="이 투자일지를 완전히 삭제하시겠습니까?"
          className="w-full rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
        >
          삭제
        </ConfirmSubmitButton>
      </form>
    </Card>
  );
}
