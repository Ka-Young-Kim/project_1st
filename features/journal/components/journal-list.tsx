import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { deleteJournal } from "@/features/journal/actions/delete-journal";
import { TradeActionToggle } from "@/features/journal/components/trade-action-toggle";
import { updateJournal } from "@/features/journal/actions/update-journal";
import { JournalListItem } from "@/features/journal/types";
import { formatCurrency, formatDateInput, formatDisplayDate } from "@/lib/utils";

export function JournalList({
  entries,
  items,
}: Readonly<{
  entries: JournalListItem[];
  items: Array<{ id: string; name: string; code: string }>;
}>) {
  const fieldClassName =
    "appearance-none border-white/12 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";

  return (
    <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <div className="space-y-3 overflow-y-auto pr-1 xl:max-h-[39rem]">
        {entries.length === 0 ? (
          <EmptyState
            title="투자일지가 없습니다"
            description="아래에서 첫 거래 기록을 남기면 여기서 바로 확인할 수 있습니다."
          />
        ) : (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-[1.25rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(22,32,58,.96),rgba(20,29,53,.96))] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,.18)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <SettingsDialog
                        trigger={
                          <button
                            type="button"
                            className="cursor-pointer text-left text-[1.05rem] font-semibold leading-snug tracking-tight text-white transition hover:text-[#8fb0ec]"
                          >
                            {entry.itemName ?? entry.symbol}
                          </button>
                        }
                      >
                        <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] p-5 text-white shadow-[0_14px_40px_rgba(0,0,0,.28)] sm:p-6">
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

                            <div className="grid gap-4 md:grid-cols-2">
                              <label className="space-y-2">
                                <span className="text-sm font-medium">거래일</span>
                                <Input
                                  name="tradeDate"
                                  type="date"
                                  defaultValue={formatDateInput(entry.tradeDate)}
                                  required
                                  className={`${fieldClassName} py-2`}
                                />
                              </label>
                              <label className="space-y-2">
                                <span className="text-sm font-medium">투자 항목</span>
                                <Select
                                  name="investmentItemId"
                                  required
                                  defaultValue={entry.investmentItemId ?? ""}
                                  className={`${fieldClassName} py-2.5`}
                                >
                                  <option value="" className="bg-[#141d35] text-white">
                                    항목 선택
                                  </option>
                                  {items.map((item) => (
                                    <option
                                      key={item.id}
                                      value={item.id}
                                      className="bg-[#141d35] text-white"
                                    >
                                      {item.name} ({item.code})
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
                                  className={`${fieldClassName} py-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                                />
                              </label>
                              <label className="space-y-2">
                                <span className="text-sm font-medium">가격 (KRW)</span>
                                <Input
                                  name="price"
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  defaultValue={entry.price}
                                  required
                                  className={`${fieldClassName} py-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                                />
                              </label>
                            </div>

                            <label className="space-y-2">
                              <span className="text-sm font-medium">투자 이유</span>
                              <Textarea
                                name="reason"
                                defaultValue={entry.reason}
                                required
                                className={`${fieldClassName} min-h-24 py-2.5`}
                              />
                            </label>

                            <label className="space-y-2">
                              <span className="text-sm font-medium">회고</span>
                              <Textarea
                                name="review"
                                defaultValue={entry.review ?? ""}
                                className={`${fieldClassName} min-h-24 py-2.5`}
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
                            <ConfirmSubmitButton
                              confirmMessage="이 투자일지를 완전히 삭제하시겠습니까?"
                              className="w-full rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                            >
                              삭제
                            </ConfirmSubmitButton>
                          </form>
                        </Card>
                      </SettingsDialog>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-[#93a4c7]">
                        <span>{formatDisplayDate(entry.tradeDate)}</span>
                        {entry.itemName ? <span>{entry.symbol}</span> : null}
                        <span>{entry.quantity}주</span>
                        <span>{formatCurrency(entry.price)}</span>
                      </div>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      <Badge tone={entry.action} compact>
                        {entry.action}
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
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
