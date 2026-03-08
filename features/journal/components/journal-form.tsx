import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createJournal } from "@/features/journal/actions/create-journal";
import { TradeActionToggle } from "@/features/journal/components/trade-action-toggle";

type JournalFormItemOption = {
  id: string;
  name: string;
  code: string;
};

export function JournalForm({
  items,
  portfolioId,
}: Readonly<{
  items: JournalFormItemOption[];
  portfolioId: string;
}>) {
  const fieldClassName =
    "appearance-none border-white/12 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";
  const itemsHref = `/items?${new URLSearchParams({ portfolio: portfolioId }).toString()}`;

  if (items.length === 0) {
    return (
      <Card className="h-fit bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
              Composer
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              새 투자일지 추가
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#93a4c7]">
              투자일지는 등록된 항목을 기준으로 작성합니다.
            </p>
          </div>

          <div className="inline-flex h-10 items-center rounded-full border border-[rgba(110,168,254,0.22)] bg-[rgba(110,168,254,0.1)] px-4 text-sm font-semibold text-[#cfe1ff]">
            Quick Log
          </div>
        </div>

        <div className="mt-6 rounded-[1.4rem] border border-dashed border-white/10 bg-black/10 px-5 py-6">
          <h3 className="text-lg font-semibold text-white">
            먼저 투자 항목을 추가하세요
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#93a4c7]">
            현재 포트폴리오에 선택할 항목이 없습니다. 투자 항목을 먼저 등록하면
            거래 로그를 바로 연결할 수 있습니다.
          </p>
          <Link
            href={itemsHref}
            className="mt-4 inline-flex h-11 items-center rounded-full border border-[rgba(110,168,254,0.28)] bg-[rgba(110,168,254,0.12)] px-5 text-sm font-semibold text-[#cfe1ff] transition hover:bg-[rgba(110,168,254,0.18)]"
          >
            투자 항목 관리로 이동
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-fit bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            Composer
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            새 투자일지 추가
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#93a4c7]">
            거래일과 종목, 수량만 먼저 기록하고 이유와 회고는 필요한 만큼만 남기세요.
          </p>
        </div>

        <div className="inline-flex h-10 items-center rounded-full border border-[rgba(110,168,254,0.22)] bg-[rgba(110,168,254,0.1)] px-4 text-sm font-semibold text-[#cfe1ff]">
          Quick Log
        </div>
      </div>

      <form action={createJournal} className="mt-6 space-y-4.5">
        <input type="hidden" name="portfolioId" value={portfolioId} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">거래일</span>
            <Input
              name="tradeDate"
              type="date"
              required
              className={`${fieldClassName} py-2`}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">투자 항목</span>
            <Select
              name="investmentItemId"
              required
              className={`${fieldClassName} py-2.5`}
              defaultValue=""
            >
              <option value="" className="bg-[#141d35] text-white">
                항목 선택
              </option>
              {items.map((item) => (
                <option key={item.id} value={item.id} className="bg-[#141d35] text-white">
                  {item.name} ({item.code})
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">매매 유형</span>
            <TradeActionToggle name="action" defaultValue="buy" />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">수량</span>
            <Input
              name="quantity"
              type="number"
              step="0.0001"
              min="0.0001"
              required
              className={`${fieldClassName} py-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">가격 (KRW)</span>
            <Input
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              required
              className={`${fieldClassName} py-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            />
          </label>
        </div>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-white/88">투자 이유</span>
          <Textarea
            name="reason"
            placeholder="왜 이 거래를 했는지 기록하세요"
            required
            className={`${fieldClassName} min-h-24 py-2.5`}
          />
        </label>

        <label className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-white/88">회고</span>
            <span className="text-xs text-[#93a4c7]">선택 입력</span>
          </div>
          <Textarea
            name="review"
            placeholder="체결 후 관찰 포인트나 회고를 남기세요"
            className={`${fieldClassName} min-h-24 py-2.5`}
          />
        </label>

        <div className="flex items-center justify-between gap-4 rounded-[1.15rem] border border-white/8 bg-black/10 px-4 py-3">
          <p className="text-xs leading-5 text-[#93a4c7]">
            먼저 항목을 등록한 뒤 선택해서 거래 로그를 연결하세요.
          </p>
          <SubmitButton
            className="min-w-[9rem]"
            pendingLabel="기록 저장 중..."
          >
            투자일지 저장
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
}
