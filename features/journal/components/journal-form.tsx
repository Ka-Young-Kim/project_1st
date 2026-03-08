import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createJournal } from "@/features/journal/actions/create-journal";

export function JournalForm() {
  return (
    <Card className="h-fit">
      <div>
        <h2 className="text-xl font-semibold">새 투자일지 추가</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          종목 코드는 직접 입력하며, 통화는 KRW 기준으로 기록합니다.
        </p>
      </div>

      <form action={createJournal} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">거래일</span>
            <Input name="tradeDate" type="date" required />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium">종목 코드</span>
            <Input
              name="symbol"
              placeholder="005930 또는 AAPL"
              required
              maxLength={20}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium">매매 유형</span>
            <Select name="action" required defaultValue="buy">
              <option value="buy">buy</option>
              <option value="sell">sell</option>
            </Select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium">수량</span>
            <Input name="quantity" type="number" step="0.0001" min="0.0001" required />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium">가격 (KRW)</span>
            <Input name="price" type="number" step="0.01" min="0.01" required />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium">투자 이유</span>
          <Textarea
            name="reason"
            placeholder="왜 이 거래를 했는지 기록하세요"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">회고</span>
          <Textarea
            name="review"
            placeholder="체결 후 관찰 포인트나 회고를 남기세요"
          />
        </label>

        <SubmitButton className="w-full" pendingLabel="기록 저장 중...">
          투자일지 저장
        </SubmitButton>
      </form>
    </Card>
  );
}
