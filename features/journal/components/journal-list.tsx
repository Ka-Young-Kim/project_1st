import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { deleteJournal } from "@/features/journal/actions/delete-journal";
import { updateJournal } from "@/features/journal/actions/update-journal";
import { JournalListItem } from "@/features/journal/types";
import { formatCurrency, formatDateInput, formatDisplayDate } from "@/lib/utils";

export function JournalList({
  entries,
}: Readonly<{
  entries: JournalListItem[];
}>) {
  return (
    <Card>
      <div>
        <h2 className="text-xl font-semibold">기록 목록</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          거래일 역순으로 정렬되며 회고는 선택 입력입니다.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {entries.length === 0 ? (
          <EmptyState
            title="투자일지가 없습니다"
            description="첫 거래 기록을 남기면 최근 판단과 회고를 한곳에서 볼 수 있습니다."
          />
        ) : (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold">{entry.symbol}</h3>
                    <Badge tone={entry.action}>{entry.action}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {formatDisplayDate(entry.tradeDate)} · {entry.quantity}주 ·{" "}
                    {formatCurrency(entry.price)}
                  </p>
                </div>

                <form action={deleteJournal}>
                  <input type="hidden" name="id" value={entry.id} />
                  <ConfirmSubmitButton
                    confirmMessage="이 투자일지를 완전히 삭제하시겠습니까?"
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    삭제
                  </ConfirmSubmitButton>
                </form>
              </div>

              <div className="mt-4 space-y-3 text-sm leading-6">
                <div>
                  <p className="font-semibold">투자 이유</p>
                  <p className="mt-1 text-[var(--muted)]">{entry.reason}</p>
                </div>
                {entry.review ? (
                  <div>
                    <p className="font-semibold">회고</p>
                    <p className="mt-1 text-[var(--muted)]">{entry.review}</p>
                  </div>
                ) : null}
              </div>

              <details className="mt-5 rounded-[1.25rem] border border-dashed border-[var(--border)] p-4">
                <summary className="cursor-pointer text-sm font-semibold">
                  기록 수정
                </summary>
                <form action={updateJournal} className="mt-4 space-y-4">
                  <input type="hidden" name="id" value={entry.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-medium">거래일</span>
                      <Input
                        name="tradeDate"
                        type="date"
                        defaultValue={formatDateInput(entry.tradeDate)}
                        required
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium">종목 코드</span>
                      <Input name="symbol" defaultValue={entry.symbol} required />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="space-y-2">
                      <span className="text-sm font-medium">매매 유형</span>
                      <Select name="action" defaultValue={entry.action} required>
                        <option value="buy">buy</option>
                        <option value="sell">sell</option>
                      </Select>
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
                      />
                    </label>
                  </div>

                  <label className="space-y-2">
                    <span className="text-sm font-medium">투자 이유</span>
                    <Textarea name="reason" defaultValue={entry.reason} required />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium">회고</span>
                    <Textarea name="review" defaultValue={entry.review ?? ""} />
                  </label>

                  <SubmitButton pendingLabel="수정 저장 중...">수정 저장</SubmitButton>
                </form>
              </details>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
