import Link from "next/link";
import { Fragment } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import {
  InvestmentItemCategory,
  isCodeManagedCategory,
} from "@/features/investment-items/lib/category";
import { createJournal } from "@/features/journal/actions/create-journal";
import { TradeActionToggle } from "@/features/journal/components/trade-action-toggle";
import { getTodayDateInputInSeoul } from "@/lib/utils";

type JournalFormItemOption = {
  id: string;
  name: string;
  code: string;
  category: InvestmentItemCategory;
};

type JournalFormAccountOption = {
  id: string;
  name: string;
  bank: string;
  displayId: string;
};

export function JournalForm({
  items,
  accounts,
  portfolioId,
  embedded = false,
  redirectMonth,
  redirectDate,
}: Readonly<{
  items: JournalFormItemOption[];
  accounts: JournalFormAccountOption[];
  portfolioId: string;
  embedded?: boolean;
  redirectMonth?: string;
  redirectDate?: string;
}>) {
  const today = getTodayDateInputInSeoul();
  const itemsHref = `/items?${new URLSearchParams({ portfolio: portfolioId }).toString()}`;
  const accountsHref = `/accounts?${new URLSearchParams({ portfolio: portfolioId }).toString()}`;
  const Wrapper = embedded ? Fragment : Card;
  const wrapperProps = embedded ? {} : { className: "h-fit" };

  if (accounts.length === 0) {
    return (
      <Wrapper {...wrapperProps}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className={embedded ? "pr-14" : ""}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
              Composer
            </p>
            <h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight">
              새 투자일지 추가
            </h2>
            <p className="mt-1.5 text-[13px] leading-5 text-[#93a4c7]">
              투자일지는 계좌와 투자 항목이 모두 준비된 뒤 작성할 수 있습니다.
            </p>
          </div>

          {embedded ? null : (
            <div className="inline-flex h-9 items-center rounded-full border border-[rgba(110,168,254,0.22)] bg-[rgba(110,168,254,0.1)] px-3.5 text-[13px] font-semibold text-[#cfe1ff]">
              Quick Log
            </div>
          )}
        </div>

        <div className="mt-5 rounded-[1rem] border border-dashed border-white/10 bg-black/10 px-4 py-5">
          <h3 className="text-lg font-semibold text-white">
            먼저 계좌를 등록하세요
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#93a4c7]">
            현재 포트폴리오에 선택할 계좌가 없습니다. 계좌를 먼저 등록하거나 불러오면
            거래 로그를 바로 연결할 수 있습니다.
          </p>
          <Link
            href={accountsHref}
            className="mt-4 inline-flex h-10 items-center rounded-full border border-[rgba(110,168,254,0.28)] bg-[rgba(110,168,254,0.12)] px-4 text-sm font-semibold text-[#cfe1ff] transition hover:bg-[rgba(110,168,254,0.18)]"
          >
            계좌 관리로 이동
          </Link>
        </div>
      </Wrapper>
    );
  }

  if (items.length === 0) {
    return (
      <Wrapper {...wrapperProps}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className={embedded ? "pr-14" : ""}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
              Composer
            </p>
            <h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight">
              새 투자일지 추가
            </h2>
            <p className="mt-1.5 text-[13px] leading-5 text-[#93a4c7]">
              투자일지는 등록된 항목을 기준으로 작성합니다.
            </p>
          </div>

          {embedded ? null : (
            <div className="inline-flex h-9 items-center rounded-full border border-[rgba(110,168,254,0.22)] bg-[rgba(110,168,254,0.1)] px-3.5 text-[13px] font-semibold text-[#cfe1ff]">
              Quick Log
            </div>
          )}
        </div>

        <div className="mt-5 rounded-[1rem] border border-dashed border-white/10 bg-black/10 px-4 py-5">
          <h3 className="text-lg font-semibold text-white">
            먼저 투자 항목을 추가하세요
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#93a4c7]">
            현재 포트폴리오에 선택할 항목이 없습니다. 투자 항목을 먼저 등록하면
            거래 로그를 바로 연결할 수 있습니다.
          </p>
          <Link
            href={itemsHref}
            className="mt-4 inline-flex h-10 items-center rounded-full border border-[rgba(110,168,254,0.28)] bg-[rgba(110,168,254,0.12)] px-4 text-sm font-semibold text-[#cfe1ff] transition hover:bg-[rgba(110,168,254,0.18)]"
          >
            투자 항목 관리로 이동
          </Link>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper {...wrapperProps}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className={embedded ? "pr-14" : ""}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            Composer
          </p>
          <h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight">
            새 투자일지 추가
          </h2>
          <p className="mt-1.5 text-[13px] leading-5 text-[#93a4c7]">
            종목별 투자 일지를 작성해주세요.
          </p>
        </div>

        {embedded ? null : (
          <div className="inline-flex h-9 items-center rounded-full border border-[rgba(110,168,254,0.22)] bg-[rgba(110,168,254,0.1)] px-3.5 text-[13px] font-semibold text-[#cfe1ff]">
            Quick Log
          </div>
        )}
      </div>

      <form action={createJournal} className="mt-5 space-y-4">
        <input type="hidden" name="portfolioId" value={portfolioId} />
        <input type="hidden" name="redirectMonth" value={redirectMonth ?? ""} />
        <input type="hidden" name="redirectDate" value={redirectDate ?? ""} />
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">거래일</span>
            <Input
              name="tradeDate"
              type="date"
              defaultValue={today}
              required
              tone="dark"
              className="py-2"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">계좌</span>
            <Select
              name="portfolioAccountId"
              required
              tone="dark"
              className="py-2.5"
              defaultValue={accounts[0]?.id ?? ""}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </Select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">투자 항목</span>
            <Select
              name="investmentItemId"
              required
              tone="dark"
              className="py-2.5"
              defaultValue=""
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

        <div className="grid gap-3 md:grid-cols-3">
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
              tone="dark"
              className="py-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-white/88">가격</span>
            <Input
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              required
              tone="dark"
              className="py-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </label>
        </div>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-white/88">매매 이유</span>
          <Textarea
            name="reason"
            placeholder="왜 이 매매를 했는지 기록하세요"
            required
            tone="dark"
            className="min-h-24 py-2.5"
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
            tone="dark"
            className="min-h-24 py-2.5"
          />
        </label>

        <div className="flex items-center justify-between gap-3 rounded-[1rem] border border-white/8 bg-black/10 px-3.5 py-2.5">
          <p className="text-[11px] leading-5 text-[#93a4c7]">
            계좌와 항목을 선택한 뒤 거래 로그를 연결하세요.
          </p>
          <SubmitButton
            className="min-w-[9rem]"
            pendingLabel="기록 저장 중..."
          >
            투자일지 저장
          </SubmitButton>
        </div>
      </form>
    </Wrapper>
  );
}
