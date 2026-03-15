import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import {
  InvestmentItemCategory,
  isCodeManagedCategory,
} from "@/features/investment-items/lib/category";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { deleteJournal } from "@/features/journal/actions/delete-journal";
import { JournalForm } from "@/features/journal/components/journal-form";
import { TradeActionToggle } from "@/features/journal/components/trade-action-toggle";
import { updateJournal } from "@/features/journal/actions/update-journal";
import { JournalListItem } from "@/features/journal/types";
import {
  formatCurrency,
  formatDateInput,
  formatDisplayDate,
  formatTradeActionLabel,
} from "@/lib/utils";

export function JournalList({
  entries,
  items,
  accounts,
  portfolioId,
  viewAllHref = "/journal",
}: Readonly<{
  entries: JournalListItem[];
  items: Array<{
    id: string;
    name: string;
    code: string;
    category: InvestmentItemCategory;
  }>;
  accounts: Array<{ id: string; name: string; displayId: string }>;
  portfolioId: string;
  viewAllHref?: string;
}>) {
  return (
    <Card className="min-w-0 text-white">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            List
          </p>
          <h2 className="mt-2 text-[1.15rem] font-semibold tracking-tight">
            거래 목록
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={viewAllHref}
            className="inline-flex h-9 items-center rounded-full border border-[rgba(110,168,254,0.28)] bg-[rgba(110,168,254,0.12)] px-3.5 text-[13px] font-semibold text-[#cfe1ff] transition hover:bg-[rgba(110,168,254,0.18)]"
          >
            전체 보기
          </Link>
          <SettingsDialog
            trigger={
              <button
                type="button"
                aria-label="새 투자일지 추가 열기"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#84adff]/35 bg-[#203764]/70 text-white transition hover:bg-[#274577]"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 4.5v11M4.5 10h11"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            }
          >
            <Card surface="dialog" className="p-5 sm:p-6">
              <JournalForm
                items={items}
                accounts={accounts}
                portfolioId={portfolioId}
                embedded
              />
            </Card>
          </SettingsDialog>
        </div>
      </div>
      <div className="space-y-3 overflow-y-auto pr-1 xl:max-h-[39rem]">
        {entries.length === 0 ? (
          <EmptyState
            title="투자일지가 없습니다"
            description="아래에서 첫 거래 기록을 남기면 여기서 바로 확인할 수 있습니다."
          />
        ) : (
          entries.map((entry) => (
            <SettingsDialog
              key={entry.id}
              trigger={
                <article className="rounded-[1.25rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(22,32,58,.96),rgba(20,29,53,.96))] shadow-[0_10px_30px_rgba(0,0,0,.18)] transition hover:border-[#8fb6ff]/25 hover:bg-[linear-gradient(180deg,rgba(24,35,63,.98),rgba(20,29,53,.98))]">
                  <div className="cursor-pointer px-4 py-3 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="whitespace-nowrap text-[1.05rem] font-semibold leading-snug tracking-tight text-white transition hover:text-[#8fb0ec]">
                              {entry.itemName ?? entry.symbol}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-[#93a4c7]">
                              <span className="shrink-0">{formatDisplayDate(entry.tradeDate)}</span>
                              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                                {entry.portfolioAccountName ? (
                                  <span className="shrink-0">{entry.portfolioAccountName}</span>
                                ) : null}
                                {entry.itemName ? (
                                  <span className="shrink-0">{entry.symbol}</span>
                                ) : null}
                                <span className="shrink-0">{entry.quantity}주</span>
                                <span className="shrink-0">{formatCurrency(entry.price)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 pt-0.5">
                            <Badge tone={entry.action} compact>
                              {formatTradeActionLabel(entry.action)}
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-2 space-y-2">
                          <p className="text-sm leading-6 text-[#8fb0ec]">{entry.reason}</p>
                          {entry.review ? (
                            <p className="text-sm leading-6 text-white/55">
                              회고: {entry.review}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              }
            >
                        <Card surface="dialog" className="p-5 sm:p-6">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
                              Journal Entry
                            </p>
                            <h3 className="mt-3 text-2xl font-semibold">
                              {entry.itemName ?? entry.symbol}
                            </h3>
                          </div>

                          <form action={updateJournal} className="mt-6 space-y-4">
                            <input type="hidden" name="id" value={entry.id} />
                            <input type="hidden" name="portfolioId" value={portfolioId} />

                            <div className="grid gap-4 md:grid-cols-3">
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
                                      {account.displayId
                                        ? `${account.name} (${account.displayId})`
                                        : account.name}
                                    </option>
                                  ))}
                                </Select>
                              </label>
                              <label className="space-y-2">
                                <span className="text-sm font-medium">투자 항목</span>
                                <Select
                                  name="investmentItemId"
                                  required
                                  defaultValue={entry.investmentItemId ?? ""}
                                  tone="dark"
                                  className="py-2.5"
                                >
                                  <option value="">
                                    항목 선택
                                  </option>
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

                            <div className="grid gap-4 md:grid-cols-3">
                              <label className="space-y-2">
                                <span className="text-sm font-medium">매매 유형</span>
                                <TradeActionToggle
                                  name="action"
                                  defaultValue={entry.action}
                                />
                              </label>
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

                            <SubmitButton
                              className="w-full"
                              pendingLabel="수정 저장 중..."
                            >
                              수정 저장
                            </SubmitButton>
                          </form>

                          <form action={deleteJournal} className="mt-3">
                            <input type="hidden" name="id" value={entry.id} />
                            <input type="hidden" name="portfolioId" value={portfolioId} />
                            <ConfirmSubmitButton
                              confirmMessage="이 투자일지를 완전히 삭제하시겠습니까?"
                              className="w-full rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                            >
                              삭제
                            </ConfirmSubmitButton>
                          </form>
                        </Card>
            </SettingsDialog>
          ))
        )}
      </div>
    </Card>
  );
}
