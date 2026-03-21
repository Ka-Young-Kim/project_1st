"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { createPortfolioAccountAction } from "@/features/portfolios/actions/create-portfolio-account";
import { deletePortfolioAccountAction } from "@/features/portfolios/actions/delete-portfolio-account";
import { updatePortfolioAccountAction } from "@/features/portfolios/actions/update-portfolio-account";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import type { PortfolioManagementData } from "@/features/portfolios/services/portfolio-management-service";
import { formatWon } from "@/lib/utils";
import { cx } from "@/lib/utils";

type AccountSummary = PortfolioManagementData["accounts"][number];
type PortfolioItemSummary = PortfolioManagementData["portfolioItems"][number];

const fieldClassName =
  "appearance-none border-white/12 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";

function buildAccountsHref(portfolioId: string, accountId?: string) {
  const params = new URLSearchParams({ portfolio: portfolioId });

  if (accountId) {
    params.set("account", accountId);
  }

  return `/accounts?${params.toString()}`;
}

function getAccountMeta(account: { bank?: string; displayId?: string }) {
  return [account.bank, account.displayId].filter(Boolean).join(" · ");
}

function formatPercent(value: number) {
  return `${value.toFixed(1).replace(/\.0$/, "")}%`;
}

function ProfitTone({
  value,
  suffix = "%",
}: Readonly<{
  value: number;
  suffix?: string;
}>) {
  const text = suffix === "%" ? formatPercent(value) : formatWon(String(value));

  return (
    <span className={value >= 0 ? "text-[#ff8e8e]" : "text-[#8fb6ff]"}>
      {text}
    </span>
  );
}

function SummaryBox({
  label,
  value,
}: Readonly<{
  label: string;
  value: ReactNode;
}>) {
  return (
    <div className="rounded-[1rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-3.5 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
        {label}
      </p>
      <div className="mt-1.5 break-all text-[0.98rem] font-semibold tracking-tight text-white">
        {value}
      </div>
    </div>
  );
}

function AccountCreateDialogContent({
  portfolioId,
  sortOrder,
}: Readonly<{
  portfolioId: string;
  sortOrder: number;
}>) {
  return (
    <form action={createPortfolioAccountAction} className="mt-5 space-y-4">
      <input type="hidden" name="portfolioId" value={portfolioId} />
      <input
        type="hidden"
        name="returnTo"
        value={buildAccountsHref(portfolioId)}
      />
      <input type="hidden" name="sortOrder" value={sortOrder} />
      <input type="hidden" name="cashBalance" value="0" />
      <label className="space-y-1.5">
        <span className="text-sm font-medium">이름</span>
        <Input name="name" required className={`${fieldClassName} py-2.5`} />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium">은행</span>
          <Input name="bank" required className={`${fieldClassName} py-2.5`} />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">계좌 번호</span>
          <Input
            name="displayId"
            required
            className={`${fieldClassName} py-2.5`}
          />
        </label>
      </div>
      <SubmitButton className="w-full" pendingLabel="계좌 저장 중...">
        계좌 추가
      </SubmitButton>
    </form>
  );
}

function AccountImportDialogContent() {
  return (
    <>
      <p className="text-sm leading-6 text-[#93a4c7]">
        외부 증권사 계좌를 연결해 계좌 목록과 보유 항목을 가져오는 흐름을 준비
        중입니다. 이번 단계에서는 진입 위치와 설명만 먼저 제공합니다.
      </p>
      <div className="mt-5 rounded-[1rem] border border-[#6ea8fe]/20 bg-[#6ea8fe]/8 px-4 py-3 text-sm leading-6 text-[#cfe1ff]">
        실제 연동이 추가되면 계좌 선택, 인증, 불러오기 미리보기, 동기화 기록이
        이 다이얼로그에 이어집니다.
      </div>
    </>
  );
}

function AccountAddDialogContent({
  portfolioId,
  sortOrder,
}: Readonly<{
  portfolioId: string;
  sortOrder: number;
}>) {
  const [mode, setMode] = useState<"manual" | "import">("manual");

  return (
    <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea4cf]">
        Account Flow
      </p>
      <h4 className="mt-2 text-[1.4rem] font-semibold tracking-tight">
        계좌 추가
      </h4>

      <div className="mt-5 inline-flex rounded-full border border-white/8 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            mode === "manual" ? "bg-white/12 text-white" : "text-[#93a4c7]"
          }`}
        >
          직접 등록
        </button>
        <button
          type="button"
          onClick={() => setMode("import")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            mode === "import" ? "bg-white/12 text-white" : "text-[#93a4c7]"
          }`}
        >
          불러오기
        </button>
      </div>

      {mode === "manual" ? (
        <>
          <AccountCreateDialogContent
            portfolioId={portfolioId}
            sortOrder={sortOrder}
          />
        </>
      ) : (
        <div className="mt-5">
          <AccountImportDialogContent />
        </div>
      )}
    </Card>
  );
}

function AccountEditDialogContent({
  portfolioId,
  account,
}: Readonly<{
  portfolioId: string;
  account: AccountSummary;
}>) {
  return (
    <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <h4 className="text-xl font-semibold">계좌 수정</h4>
      <form action={updatePortfolioAccountAction} className="mt-5 space-y-4">
        <input type="hidden" name="id" value={account.id} />
        <input type="hidden" name="portfolioId" value={portfolioId} />
        <input
          type="hidden"
          name="returnTo"
          value={buildAccountsHref(portfolioId, account.id)}
        />
        <input type="hidden" name="sortOrder" value={account.sortOrder} />
        <input
          type="hidden"
          name="cashBalance"
          value={String(account.cashBalance)}
        />
        <label className="space-y-1.5">
          <span className="text-sm font-medium">이름</span>
          <Input
            name="name"
            defaultValue={account.name}
            required
            className={`${fieldClassName} py-2.5`}
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium">은행</span>
            <Input
              name="bank"
              defaultValue={account.bank}
              required
              className={`${fieldClassName} py-2.5`}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium">계좌 번호</span>
            <Input
              name="displayId"
              defaultValue={account.displayId}
              required
              className={`${fieldClassName} py-2.5`}
            />
          </label>
        </div>
        <SubmitButton className="w-full" pendingLabel="저장 중...">
          계좌 저장
        </SubmitButton>
      </form>
    </Card>
  );
}

function AccountItemRow({
  item,
}: Readonly<{
  item: PortfolioItemSummary;
}>) {
  return (
    <div className="rounded-[1rem] border border-white/8 bg-black/15 px-3.5 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {item.name}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#93a4c7]">
            {[item.code, item.groupName, `수량 ${item.quantity}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-right sm:min-w-[12rem]">
          <div>
            <p className="text-[10px] text-[#93a4c7]">평가금</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {formatWon(String(item.marketValue))}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[#93a4c7]">수익률</p>
            <p className="mt-1 text-sm font-semibold">
              <ProfitTone value={item.profitRate} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioAccountListCard({
  portfolioId,
  accounts,
  selectedAccount,
  collapseOnSelection,
}: Readonly<{
  portfolioId: string;
  accounts: AccountSummary[];
  selectedAccount?: AccountSummary;
  collapseOnSelection: boolean;
}>) {
  return (
    <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            Accounts
          </p>
          <h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight">
            계좌 목록
          </h2>
          <p className="mt-2 text-[13px] leading-6 text-[#9fb4d8]">
            직접 등록과 불러오기를 같은 위치에서 관리하고, 선택한 계좌 상세는
            아래 카드에서 확인합니다.
          </p>
        </div>
      </div>

      <details
        open={!collapseOnSelection}
        className="mt-5 rounded-2xl border border-white/8"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">계좌</h3>
            {selectedAccount ? (
              <span className="rounded-full border border-[#8fb6ff]/18 bg-[#8fb6ff]/10 px-2.5 py-1 text-[11px] font-semibold text-[#dce7ff]">
                {selectedAccount.name}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#93a4c7]">{accounts.length}개</span>
            <SettingsDialog
              stopPropagationOnTriggerClick
              dialogClassName="max-w-[min(92vw,42rem)]"
              trigger={
                <button
                  type="button"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold leading-none text-[#dce7ff] transition hover:bg-white/10"
                  aria-label="계좌 추가"
                >
                  +
                </button>
              }
            >
              <AccountAddDialogContent
                portfolioId={portfolioId}
                sortOrder={accounts.length}
              />
            </SettingsDialog>
          </div>
        </summary>
        <div className="border-t border-white/8 p-4">
          {accounts.length === 0 ? (
            <EmptyState
              title="등록된 계좌가 없습니다"
              description="직접 등록으로 첫 계좌를 만들거나, 곧 추가될 불러오기 흐름을 준비해 둘 수 있습니다."
            />
          ) : (
            <div className="max-h-[23.25rem] space-y-3 overflow-y-auto pr-1">
              {accounts.map((account) => {
                const href = buildAccountsHref(portfolioId, account.id);
                const isSelected = account.id === selectedAccount?.id;

                return (
                  <Link
                    key={account.id}
                    href={href}
                    className={cx(
                      "block rounded-[1.15rem] border px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,.18)] transition",
                      isSelected
                        ? "border-[#8fb6ff]/30 bg-[linear-gradient(180deg,rgba(36,56,96,.82),rgba(23,35,63,.9))]"
                        : "border-[var(--border)] bg-[linear-gradient(180deg,rgba(22,32,58,.96),rgba(20,29,53,.96))] hover:border-[#8fb6ff]/18",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-white">
                          {account.name}
                        </p>
                        {getAccountMeta(account) ? (
                          <p className="mt-1 text-xs text-[#93a4c7]">
                            {getAccountMeta(account)}
                          </p>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[#93a4c7]">평가금</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {formatWon(String(account.marketValue))}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#93a4c7]">
                      <span>{account.items.length}개 항목</span>
                      <span>
                        투자금 {formatWon(String(account.investedAmount))}
                      </span>
                      <span>수익률 {formatPercent(account.profitRate)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </details>
    </Card>
  );
}

function PortfolioAccountDetailCard({
  portfolioId,
  account,
}: Readonly<{
  portfolioId: string;
  account: AccountSummary;
}>) {
  return (
    <Card className="border-white/8 bg-[linear-gradient(180deg,rgba(18,28,52,.98),rgba(14,22,42,.98))] p-5 text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            Account Detail
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h2 className="text-[1.25rem] font-semibold tracking-tight">
              <SettingsDialog
                trigger={
                  <button
                    type="button"
                    className="rounded-sm text-left text-white underline decoration-white/30 decoration-1 underline-offset-4 transition hover:text-[#cfe1ff] hover:decoration-[#cfe1ff]"
                  >
                    {account.name}
                  </button>
                }
              >
                <AccountEditDialogContent
                  portfolioId={portfolioId}
                  account={account}
                />
              </SettingsDialog>
            </h2>
          </div>
          {getAccountMeta(account) ? (
            <p className="mt-2 text-[13px] leading-6 text-[#9fb4d8]">
              {getAccountMeta(account)}
            </p>
          ) : null}
        </div>

        <form action={deletePortfolioAccountAction} className="shrink-0">
          <input type="hidden" name="id" value={account.id} />
          <input type="hidden" name="portfolioId" value={portfolioId} />
          <input
            type="hidden"
            name="returnTo"
            value={buildAccountsHref(portfolioId)}
          />
          <ConfirmSubmitButton
            aria-label="계좌 삭제"
            title="계좌 삭제"
            confirmMessage="이 계좌를 삭제하시겠습니까? 연결된 항목은 미지정으로 이동됩니다."
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose-300/30 bg-rose-400/10 text-[1.45rem] leading-none text-rose-100 transition hover:bg-rose-400/20"
          >
            ×
          </ConfirmSubmitButton>
        </form>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <SummaryBox
          label="평가금"
          value={formatWon(String(account.marketValue))}
        />
        <SummaryBox
          label="투자금"
          value={formatWon(String(account.investedAmount))}
        />
        <SummaryBox
          label="수익률"
          value={<ProfitTone value={account.profitRate} />}
        />
      </div>

      <div className="mt-5 rounded-[1rem] border border-white/8 bg-white/4 px-4 py-3 text-sm leading-6 text-[#9fb4d8]">
        연결된 항목의 자산군 배치와 포트폴리오 구성 관리는
        <Link
          href={`/portfolios?${new URLSearchParams({ portfolio: portfolioId }).toString()}`}
          className="ml-1 font-semibold text-[#cfe1ff] underline underline-offset-4"
        >
          포트폴리오 구성
        </Link>
        에서 이어집니다.
      </div>

      <div className="mt-5 overflow-hidden rounded-[1rem] border border-white/8 bg-black/15">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <p className="text-sm font-semibold text-[#dce7ff]">연결 항목</p>
          <span className="text-xs text-[#93a4c7]">
            {account.items.length}개
          </span>
        </div>
        <div className="space-y-3 p-4">
          {account.items.length === 0 ? (
            <div className="rounded-[1rem] bg-white/[0.03] px-4 py-4 text-sm text-[#93a4c7]">
              아직 연결된 포트폴리오 항목이 없습니다.
            </div>
          ) : (
            account.items.map((item) => (
              <AccountItemRow key={item.id} item={item} />
            ))
          )}
          <div className="rounded-[1rem] bg-white/[0.03] px-4 py-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-white">현금 잔액</p>
                <p className="mt-1 text-xs text-[#93a4c7]">
                  계좌에 남아 있는 현금
                </p>
              </div>
              <p className="font-medium text-white">
                {formatWon(String(account.cashBalance))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function EmptyAccountInspector() {
  return (
    <Card className="border-white/8 bg-[linear-gradient(180deg,rgba(18,28,52,.98),rgba(14,22,42,.98))] p-5 text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
        Account Detail
      </p>
      <h2 className="mt-3 text-[1.15rem] font-semibold tracking-tight">
        계좌를 선택하세요
      </h2>
      <p className="mt-2 text-[13px] leading-6 text-[#9fb4d8]">
        위 계좌 목록에서 계좌를 선택하면 연결 항목, 평가금, 수정 액션을 여기에서
        확인할 수 있습니다.
      </p>
    </Card>
  );
}

export function PortfolioAccountManagement({
  portfolioId,
  accounts,
  selectedAccountId,
}: Readonly<{
  portfolioId: string;
  accounts: AccountSummary[];
  selectedAccountId?: string;
}>) {
  const selectedAccount = selectedAccountId
    ? accounts.find((account) => account.id === selectedAccountId)
    : undefined;
  const hasExplicitSelection = Boolean(selectedAccount);

  return (
    <div className="space-y-5">
      <PortfolioAccountListCard
        portfolioId={portfolioId}
        accounts={accounts}
        selectedAccount={selectedAccount}
        collapseOnSelection={hasExplicitSelection}
      />
      {selectedAccount ? (
        <PortfolioAccountDetailCard
          portfolioId={portfolioId}
          account={selectedAccount}
        />
      ) : (
        <EmptyAccountInspector />
      )}
    </div>
  );
}

export function PortfolioAccountsOverview({
  portfolioId,
  accounts,
}: Readonly<{
  portfolioId: string;
  accounts: AccountSummary[];
}>) {
  const realAccounts = accounts.filter(
    (account) => !account.id.startsWith("__"),
  );
  const totalMarketValue = realAccounts.reduce(
    (sum, account) => sum + account.marketValue,
    0,
  );
  const totalCashBalance = realAccounts.reduce(
    (sum, account) => sum + account.cashBalance,
    0,
  );

  return (
    <Card className="text-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            Accounts Overview
          </p>
          <h3 className="mt-2 text-[1.2rem] font-semibold tracking-tight">
            계좌 요약
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#93a4c7]">
            계좌 등록과 불러오기는 별도 계좌 추가 화면에서 진행하고, 이
            페이지에서는 배치 상태만 이어서 확인합니다.
          </p>
        </div>
        <Link
          href={buildAccountsHref(portfolioId)}
          className="inline-flex h-10 items-center rounded-full border border-[rgba(110,168,254,0.28)] bg-[rgba(110,168,254,0.12)] px-4 text-sm font-semibold text-[#cfe1ff] transition hover:bg-[rgba(110,168,254,0.18)]"
        >
          계좌 추가로 이동
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <SummaryBox label="등록 계좌 수" value={`${realAccounts.length}개`} />
        <SummaryBox
          label="현금 잔액 합계"
          value={formatWon(String(totalCashBalance))}
        />
        <SummaryBox
          label="계좌 기준 총 평가금"
          value={formatWon(String(totalMarketValue))}
        />
      </div>
    </Card>
  );
}
