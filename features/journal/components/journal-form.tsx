import Link from "next/link";
import { Fragment } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createInvestmentItemAction } from "@/features/investment-items/actions/create-investment-item";
import {
  INVESTMENT_ITEM_CATEGORIES,
  InvestmentItemCategory,
  isCodeManagedCategory,
} from "@/features/investment-items/lib/category";
import { createJournal } from "@/features/journal/actions/create-journal";
import { TradeActionToggle } from "@/features/journal/components/trade-action-toggle";
import { createPortfolioAccountAction } from "@/features/portfolios/actions/create-portfolio-account";
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

function buildJournalReturnPath({
  portfolioId,
  redirectMonth,
  redirectDate,
}: {
  portfolioId: string;
  redirectMonth?: string;
  redirectDate?: string;
}) {
  const params = new URLSearchParams();

  if (portfolioId) {
    params.set("portfolio", portfolioId);
  }

  if (redirectMonth) {
    params.set("month", redirectMonth);
  }

  if (redirectDate) {
    params.set("date", redirectDate);
  }

  const search = params.toString();
  return `/journal${search ? `?${search}` : ""}`;
}

function JournalComposerHeader({
  embedded,
  description,
}: Readonly<{
  embedded: boolean;
  description: string;
}>) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div className={embedded ? "pr-14" : ""}>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
          Composer
        </p>
        <h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight">
          새 투자일지 추가
        </h2>
        <p className="mt-1.5 text-[13px] leading-5 text-[#93a4c7]">
          {description}
        </p>
      </div>

      {embedded ? null : (
        <div className="inline-flex h-9 items-center rounded-full border border-[rgba(110,168,254,0.22)] bg-[rgba(110,168,254,0.1)] px-3.5 text-[13px] font-semibold text-[#cfe1ff]">
          Quick Log
        </div>
      )}
    </div>
  );
}

function QuickSetupShell({
  step,
  title,
  description,
  footer,
  children,
}: Readonly<{
  step: string;
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-5 rounded-[1rem] border border-white/8 bg-black/10 px-4 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea4cf]">
        {step}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#93a4c7]">{description}</p>
      <div className="mt-4 space-y-4">{children}</div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-[1rem] border border-white/8 bg-white/[0.03] px-3.5 py-2.5">
        {footer}
      </div>
    </div>
  );
}

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
  const returnTo = buildJournalReturnPath({
    portfolioId,
    redirectMonth,
    redirectDate,
  });
  const Wrapper = embedded ? Fragment : Card;
  const wrapperProps = embedded ? {} : { className: "h-fit" };

  if (accounts.length === 0) {
    return (
      <Wrapper {...wrapperProps}>
        <JournalComposerHeader
          embedded={embedded}
          description="계좌, 항목, 첫 거래를 이 화면에서 순서대로 이어서 설정할 수 있습니다."
        />

        <form action={createPortfolioAccountAction}>
          <input type="hidden" name="portfolioId" value={portfolioId} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <input type="hidden" name="sortOrder" value={accounts.length} />
          <input type="hidden" name="cashBalance" value="0" />
          <QuickSetupShell
            step="Step 1"
            title="계좌 먼저 만들기"
            description="첫 거래를 연결할 계좌만 간단히 등록하면 바로 다음 단계로 넘어갑니다."
            footer={
              <>
                <div className="text-[11px] leading-5 text-[#93a4c7]">
                  추가한 계좌의 세부 설정은 계좌 추가 화면에서 이어서 보완할 수
                  있습니다.
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={accountsHref}
                    className="inline-flex h-9 items-center rounded-full border border-white/10 bg-white/6 px-3 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    계좌 추가
                  </Link>
                  <SubmitButton
                    className="min-w-[7rem]"
                    pendingLabel="계좌 저장 중..."
                    size="sm"
                  >
                    계좌 추가
                  </SubmitButton>
                </div>
              </>
            }
          >
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-white/88">이름</span>
              <Input
                name="name"
                required
                tone="dark"
                className="py-2.5"
                placeholder="예: 주식 메인 계좌"
              />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-white/88">은행</span>
                <Input
                  name="bank"
                  required
                  tone="dark"
                  className="py-2.5"
                  placeholder="예: 미래에셋증권"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-white/88">
                  계좌 번호
                </span>
                <Input
                  name="displayId"
                  required
                  tone="dark"
                  className="py-2.5"
                  placeholder="예: 123-45-67890"
                />
              </label>
            </div>
          </QuickSetupShell>
        </form>
      </Wrapper>
    );
  }

  if (items.length === 0) {
    return (
      <Wrapper {...wrapperProps}>
        <JournalComposerHeader
          embedded={embedded}
          description="계좌 준비가 끝났습니다. 이제 첫 기록에 연결할 투자 항목을 바로 추가하세요."
        />

        <form action={createInvestmentItemAction}>
          <input type="hidden" name="portfolioId" value={portfolioId} />
          <input type="hidden" name="redirectCategory" value="all" />
          <input type="hidden" name="returnTo" value={returnTo} />
          <QuickSetupShell
            step="Step 2"
            title="투자 항목 먼저 만들기"
            description="기본 정보만 먼저 입력하면 바로 거래 기록으로 이어집니다."
            footer={
              <>
                <div className="text-[11px] leading-5 text-[#93a4c7]">
                  코드가 없는 자산은 분류를 기타로 두고 이름만 먼저 등록해도
                  됩니다.
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={itemsHref}
                    className="inline-flex h-9 items-center rounded-full border border-white/10 bg-white/6 px-3 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    항목 관리
                  </Link>
                  <SubmitButton
                    className="min-w-[7rem]"
                    pendingLabel="항목 저장 중..."
                    size="sm"
                  >
                    항목 추가
                  </SubmitButton>
                </div>
              </>
            }
          >
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-white/88">항목명</span>
              <Input
                name="name"
                required
                tone="dark"
                className="py-2.5"
                placeholder="예: 삼성전자"
              />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-white/88">분류</span>
                <Select
                  name="category"
                  required
                  tone="dark"
                  className="py-2.5"
                  defaultValue="stock"
                >
                  {INVESTMENT_ITEM_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-white/88">코드</span>
                <Input
                  name="code"
                  tone="dark"
                  className="py-2.5"
                  placeholder="예: 005930"
                />
              </label>
            </div>
          </QuickSetupShell>
        </form>
      </Wrapper>
    );
  }

  return (
    <Wrapper {...wrapperProps}>
      <JournalComposerHeader
        embedded={embedded}
        description="준비가 끝났습니다. 이제 첫 거래를 바로 기록하세요."
      />

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
              <option value="">항목 선택</option>
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
          <SubmitButton className="min-w-[9rem]" pendingLabel="기록 저장 중...">
            투자일지 저장
          </SubmitButton>
        </div>
      </form>
    </Wrapper>
  );
}
