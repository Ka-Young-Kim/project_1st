"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createPortfolioAssetGroupAction } from "@/features/portfolios/actions/create-portfolio-asset-group";
import { createPortfolioItemAction } from "@/features/portfolios/actions/create-portfolio-item";
import { deletePortfolioAssetGroupAction } from "@/features/portfolios/actions/delete-portfolio-asset-group";
import { deletePortfolioItemAction } from "@/features/portfolios/actions/delete-portfolio-item";
import { recordPortfolioSnapshotAction } from "@/features/portfolios/actions/record-portfolio-snapshot";
import { updatePortfolioAction } from "@/features/portfolios/actions/update-portfolio";
import { updatePortfolioAssetGroupAction } from "@/features/portfolios/actions/update-portfolio-asset-group";
import { updatePortfolioItemAction } from "@/features/portfolios/actions/update-portfolio-item";
import { isResidualAssetGroupName } from "@/features/portfolios/lib/asset-group";
import { PortfolioAssetGroupSelector } from "@/features/portfolios/components/portfolio-asset-group-selector";
import { PortfolioSnapshotHistory } from "@/features/portfolios/components/portfolio-snapshot-history";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import type { PortfolioManagementData } from "@/features/portfolios/services/portfolio-management-service";
import { formatWon } from "@/lib/utils";

type PortfolioItemSummary = PortfolioManagementData["portfolioItems"][number];
type AssetGroupSummary = PortfolioManagementData["assetGroups"][number];
type AccountSummary = PortfolioManagementData["accounts"][number];
type InvestmentItemOption = PortfolioManagementData["availableInvestmentItems"][number];

const fieldClassName =
  "appearance-none border-white/12 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";
const assetGroupMetricCardClassName =
  "h-full min-w-0 rounded-[1rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-3 py-2.5";
const boardActionButtonClassName =
  "inline-flex h-8 min-w-[88px] items-center justify-center whitespace-nowrap rounded-[0.9rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] px-2.5 py-1 text-[12px] font-semibold text-[#dce7ff] transition hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))]";
const boardInlineAddButtonClassName =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] text-sm font-semibold text-[#dce7ff] transition hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))]";
const itemDeleteButtonClassName =
  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-rose-300/30 bg-[linear-gradient(180deg,rgba(190,24,93,0.14),rgba(190,24,93,0.08))] text-xs font-semibold leading-none text-rose-100 transition hover:bg-[linear-gradient(180deg,rgba(190,24,93,0.2),rgba(190,24,93,0.12))]";

function formatPercent(value: number) {
  return `${value.toFixed(1).replace(/\.0$/, "")}%`;
}

function getAccountTitle(account: {
  name: string;
}) {
  return account.name;
}

function getAccountMeta(account: {
  bank?: string;
  displayId?: string;
}) {
  return [account.bank, account.displayId].filter(Boolean).join(" · ");
}

function buildAccountLabel(account: {
  name: string;
}) {
  return account.name;
}

function buildPortfolioItemAccountLabel(item: {
  accountName: string;
}) {
  return item.accountName;
}

function getAccountLabelById(accounts: AccountSummary[], accountId?: string) {
  if (!accountId) {
    return "미지정";
  }

  const account = accounts.find((candidate) => candidate.id === accountId);

  return account ? buildAccountLabel(account) : "선택 계좌";
}

function ProfitTone({
  value,
  suffix = "%",
}: Readonly<{
  value: number;
  suffix?: string;
}>) {
  const text =
    suffix === "%" ? formatPercent(value) : formatWon(String(value));

  return (
    <span className={value >= 0 ? "text-[#ff8e8e]" : "text-[#8fb6ff]"}>
      {text}
    </span>
  );
}

function AssetGroupIcon({
  name,
}: Readonly<{
  name: string;
}>) {
  const tone = "text-[#6f87ad]";

  if (name.includes("채권")) {
    return (
      <svg viewBox="0 0 24 24" className={`h-7 w-7 ${tone}`} fill="none" aria-hidden="true">
        <rect x="5" y="4.5" width="14" height="15" rx="2.5" stroke="currentColor" strokeWidth="2.1" />
        <path d="M8.5 9h7M8.5 12h7M8.5 15h4.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    );
  }

  if (name.includes("금")) {
    return (
      <svg viewBox="0 0 24 24" className={`h-7 w-7 ${tone}`} fill="none" aria-hidden="true">
        <path
          d="M10.2 13.8a3.2 3.2 0 0 1 0-4.5l2-2a3.2 3.2 0 1 1 4.5 4.5l-1 1"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <path
          d="M13.8 10.2a3.2 3.2 0 0 1 0 4.5l-2 2a3.2 3.2 0 0 1-4.5-4.5l1-1"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name.includes("배당")) {
    return (
      <svg viewBox="0 0 24 24" className={`h-7 w-7 ${tone}`} fill="none" aria-hidden="true">
        <path d="M12 5v14M7 10.5 12 5l5 5.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 18h9" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    );
  }

  if (name.includes("리츠")) {
    return (
      <svg viewBox="0 0 24 24" className={`h-7 w-7 ${tone}`} fill="none" aria-hidden="true">
        <path d="M4.5 19.5h15" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
        <path d="M6 19.5v-7.5h4v7.5M14 19.5V8.5h4v11" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 6 6.5 9h11L12 6Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name.includes("주식")) {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#ff6b7a]" fill="none" aria-hidden="true">
        <path d="M5 17.5 10 12l3 3 6-7" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 8h4v4" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={`h-7 w-7 ${tone}`} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2.1" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
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

function PortfolioItemCreateForm({
  portfolioId,
  portfolioAssetGroupId,
  portfolioAccountId,
  accountOptions,
  assetGroupOptions,
  availableInvestmentItems,
  sortOrder,
}: Readonly<{
  portfolioId: string;
  portfolioAssetGroupId?: string;
  portfolioAccountId?: string;
  accountOptions: AccountSummary[];
  assetGroupOptions: AssetGroupSummary[];
  availableInvestmentItems: InvestmentItemOption[];
  sortOrder: number;
}>) {
  const supportsExistingMode = availableInvestmentItems.length > 0;
  const [mode, setMode] = useState<"existing" | "manual">(
    supportsExistingMode ? "existing" : "manual",
  );
  const [selectedAccountId, setSelectedAccountId] = useState(portfolioAccountId ?? "");
  const [selectedInvestmentItemId, setSelectedInvestmentItemId] = useState("");
  const filteredInvestmentItems = availableInvestmentItems.filter((item) =>
    selectedAccountId ? item.accountIds.includes(selectedAccountId) : false,
  );

  return (
    <form action={createPortfolioItemAction} className="mt-5 space-y-4">
      <input type="hidden" name="portfolioId" value={portfolioId} />
      <input type="hidden" name="sortOrder" value={sortOrder} />
      <input type="hidden" name="active" value="on" />

      <div className="inline-flex rounded-full border border-white/8 bg-white/5 p-1">
        {supportsExistingMode ? (
          <button
            type="button"
            onClick={() => setMode("existing")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              mode === "existing" ? "bg-white/12 text-white" : "text-[#93a4c7]"
            }`}
          >
            기존 투자 항목
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            mode === "manual" ? "bg-white/12 text-white" : "text-[#93a4c7]"
          }`}
        >
          직접 입력
        </button>
      </div>

      {mode === "existing" ? (
        <>
          {portfolioAssetGroupId ? (
            <input type="hidden" name="portfolioAssetGroupId" value={portfolioAssetGroupId} />
          ) : (
            <label className="space-y-1.5">
              <span className="text-sm font-medium">자산군</span>
              <Select
                name="portfolioAssetGroupId"
                defaultValue=""
                className={`${fieldClassName} py-2.5 [&>option]:bg-[#15203a] [&>option]:text-white`}
              >
                <option value="">미분류</option>
                {assetGroupOptions.map((group) => (
                  <option key={group.id} value={group.id} className="bg-[#15203a] text-white">
                    {group.name}
                  </option>
                ))}
              </Select>
            </label>
          )}
          <label className="space-y-1.5">
            <span className="text-sm font-medium">계좌</span>
            {portfolioAccountId ? (
              <>
                <input type="hidden" name="portfolioAccountId" value={portfolioAccountId} />
                <div className={`rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white ${fieldClassName}`}>
                  {getAccountLabelById(accountOptions, portfolioAccountId)}
                </div>
              </>
            ) : (
              <Select
                name="portfolioAccountId"
                value={selectedAccountId}
                required
                onChange={(event) => {
                  setSelectedAccountId(event.target.value);
                  setSelectedInvestmentItemId("");
                }}
                className={`${fieldClassName} py-2.5 [&>option]:bg-[#15203a] [&>option]:text-white`}
              >
                <option value="">선택</option>
                {accountOptions.map((account) => (
                  <option key={account.id} value={account.id} className="bg-[#15203a] text-white">
                    {buildAccountLabel(account)}
                  </option>
                ))}
              </Select>
            )}
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium">투자 항목</span>
            <Select
              name="linkedInvestmentItemId"
              required
              value={selectedInvestmentItemId}
              onChange={(event) => setSelectedInvestmentItemId(event.target.value)}
              className={`${fieldClassName} py-2.5 [&>option]:bg-[#15203a] [&>option]:text-white`}
            >
              <option value="">
                {selectedAccountId
                  ? filteredInvestmentItems.length > 0
                    ? "선택"
                    : "선택한 계좌에 연결된 항목이 없습니다"
                  : "계좌를 먼저 선택하세요"}
              </option>
              {filteredInvestmentItems.map((item) => (
                <option key={item.id} value={item.id} className="bg-[#15203a] text-white">
                  {item.name} ({item.code})
                </option>
              ))}
            </Select>
            <p className="text-xs text-[#93a4c7]">
              선택한 계좌에 현재 연결된 투자 항목만 표시합니다.
            </p>
          </label>
          <input type="hidden" name="name" value="" />
          <input type="hidden" name="code" value="" />
          <input type="hidden" name="quantity" value="0" />
          <input type="hidden" name="averagePrice" value="0" />
          <input type="hidden" name="currentPrice" value="0" />
          <label className="space-y-1.5">
            <span className="text-sm font-medium">메모</span>
            <Textarea name="notes" className={`${fieldClassName} min-h-24 py-2.5`} />
          </label>
        </>
      ) : (
        <>
          <input type="hidden" name="linkedInvestmentItemId" value="" />
          {portfolioAssetGroupId ? (
            <input type="hidden" name="portfolioAssetGroupId" value={portfolioAssetGroupId} />
          ) : (
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-sm font-medium">자산군</span>
              <Select
                name="portfolioAssetGroupId"
                defaultValue=""
                className={`${fieldClassName} py-2.5 [&>option]:bg-[#15203a] [&>option]:text-white`}
              >
                <option value="">미분류</option>
                {assetGroupOptions.map((group) => (
                  <option key={group.id} value={group.id} className="bg-[#15203a] text-white">
                    {group.name}
                  </option>
                ))}
              </Select>
            </label>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-sm font-medium">항목 이름</span>
              <Input name="name" required className={`${fieldClassName} py-2.5`} />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium">코드</span>
              <Input
                name="code"
                placeholder="선택 입력"
                className={`${fieldClassName} py-2.5`}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium">계좌</span>
              {portfolioAccountId ? (
                <>
                  <input type="hidden" name="portfolioAccountId" value={portfolioAccountId} />
                  <div className={`rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white ${fieldClassName}`}>
                    {getAccountLabelById(accountOptions, portfolioAccountId)}
                  </div>
                </>
              ) : (
                <Select
                  name="portfolioAccountId"
                  defaultValue=""
                  className={`${fieldClassName} py-2.5 [&>option]:bg-[#15203a] [&>option]:text-white`}
                >
                  <option value="">미지정</option>
                  {accountOptions.map((account) => (
                    <option key={account.id} value={account.id} className="bg-[#15203a] text-white">
                      {buildAccountLabel(account)}
                    </option>
                  ))}
                </Select>
              )}
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium">수량</span>
              <Input
                name="quantity"
                type="number"
                min="0"
                step="0.0001"
                defaultValue="0"
                className={`${fieldClassName} py-2.5`}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium">평단가</span>
              <Input
                name="averagePrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className={`${fieldClassName} py-2.5`}
              />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-sm font-medium">현재가</span>
              <Input
                name="currentPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className={`${fieldClassName} py-2.5`}
              />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-sm font-medium">메모</span>
              <Textarea name="notes" className={`${fieldClassName} min-h-24 py-2.5`} />
            </label>
          </div>
        </>
      )}

      <SubmitButton className="w-full" pendingLabel="항목 저장 중...">
        항목 추가
      </SubmitButton>
    </form>
  );
}

function PortfolioItemEditorDialog({
  portfolioId,
  item,
  assetGroupOptions,
  accountOptions,
  availableInvestmentItems,
}: Readonly<{
  portfolioId: string;
  item: PortfolioItemSummary;
  assetGroupOptions: AssetGroupSummary[];
  accountOptions: AccountSummary[];
  availableInvestmentItems: InvestmentItemOption[];
}>) {
  const [linkedInvestmentItemId, setLinkedInvestmentItemId] = useState(
    item.linkedInvestmentItemId ?? "",
  );
  const isLinked = linkedInvestmentItemId.trim().length > 0;

  return (
    <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <div className="border-b border-white/8 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea4cf]">
          Portfolio Item
        </p>
        <h4 className="mt-2 text-[1.4rem] font-semibold tracking-tight">
          항목 수정
        </h4>
        <p className="mt-2 text-sm text-[#93a4c7]">
          자산군, 계좌, 투자 항목 연결 상태를 수정합니다.
        </p>
      </div>

      <form action={updatePortfolioItemAction} className="mt-5 space-y-4">
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="portfolioId" value={portfolioId} />
        <input type="hidden" name="sortOrder" value={item.sortOrder} />
        <input type="hidden" name="active" value="on" />

        <label className="space-y-1.5">
          <span className="text-sm font-medium">자산군</span>
          <Select
            name="portfolioAssetGroupId"
            defaultValue={item.groupId ?? ""}
            className={`${fieldClassName} py-2.5 [&>option]:bg-[#15203a] [&>option]:text-white`}
          >
            <option value="">미분류</option>
            {assetGroupOptions.map((group) => (
              <option key={group.id} value={group.id} className="bg-[#15203a] text-white">
                {group.name}
              </option>
            ))}
          </Select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">계좌</span>
          <Select
            name="portfolioAccountId"
            defaultValue={item.accountId ?? ""}
            className={`${fieldClassName} py-2.5 [&>option]:bg-[#15203a] [&>option]:text-white`}
          >
            <option value="">미지정</option>
            {accountOptions.map((account) => (
              <option key={account.id} value={account.id} className="bg-[#15203a] text-white">
                {buildAccountLabel(account)}
              </option>
            ))}
          </Select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">연결된 투자 항목</span>
          <Select
            name="linkedInvestmentItemId"
            value={linkedInvestmentItemId}
            onChange={(event) => setLinkedInvestmentItemId(event.target.value)}
            className={`${fieldClassName} py-2.5 [&>option]:bg-[#15203a] [&>option]:text-white`}
          >
            <option value="">직접 입력 항목</option>
            {availableInvestmentItems.map((investmentItem) => (
              <option
                key={investmentItem.id}
                value={investmentItem.id}
                className="bg-[#15203a] text-white"
              >
                {investmentItem.name} ({investmentItem.code})
              </option>
            ))}
          </Select>
        </label>

        {isLinked ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium">이름</span>
                <Input
                  value={item.name}
                  readOnly
                  className={`${fieldClassName} py-2.5 opacity-80`}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium">코드</span>
                <Input
                  value={item.code}
                  readOnly
                  className={`${fieldClassName} py-2.5 opacity-80`}
                />
              </label>
            </div>
            <p className="text-xs leading-5 text-[#93a4c7]">
              연결된 투자 항목의 이름과 코드는 원본 값을 따릅니다.
            </p>
            <input type="hidden" name="name" value={item.name} />
            <input type="hidden" name="code" value={item.code} />
            <input type="hidden" name="quantity" value={String(item.quantity)} />
            <input type="hidden" name="averagePrice" value={String(item.averagePrice)} />
            <input type="hidden" name="currentPrice" value={String(item.currentPrice)} />
          </>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-sm font-medium">이름</span>
              <Input
                name="name"
                defaultValue={item.name}
                required
                className={`${fieldClassName} py-2.5`}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium">코드</span>
              <Input
                name="code"
                defaultValue={item.code}
                className={`${fieldClassName} py-2.5`}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium">수량</span>
              <Input
                name="quantity"
                type="number"
                min="0"
                step="0.0001"
                defaultValue={String(item.quantity)}
                className={`${fieldClassName} py-2.5`}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium">평단가</span>
              <Input
                name="averagePrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={String(item.averagePrice)}
                className={`${fieldClassName} py-2.5`}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium">현재가</span>
              <Input
                name="currentPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={String(item.currentPrice)}
                className={`${fieldClassName} py-2.5`}
              />
            </label>
          </div>
        )}

        <label className="space-y-1.5">
          <span className="text-sm font-medium">메모</span>
          <Textarea
            name="notes"
            defaultValue={item.notes}
            className={`${fieldClassName} min-h-24 py-2.5`}
          />
        </label>

        <SubmitButton className="w-full" pendingLabel="항목 저장 중...">
          저장
        </SubmitButton>
      </form>

      <form action={deletePortfolioItemAction} className="mt-3">
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="portfolioId" value={portfolioId} />
        <ConfirmSubmitButton
          confirmMessage="이 항목을 삭제하시겠습니까?"
          className="w-full rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
        >
          항목 삭제
        </ConfirmSubmitButton>
      </form>
    </Card>
  );
}

function ReadonlyValueBox({
  label,
  value,
}: Readonly<{
  label: string;
  value: ReactNode;
}>) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-white">{label}</p>
      <div className="rounded-[1rem] border border-white/8 bg-white/4 px-4 py-3 text-sm text-white">
        {value}
      </div>
    </div>
  );
}

function PortfolioItemDetailDialog({
  item,
}: Readonly<{
  item: PortfolioItemSummary;
}>) {
  const accountLabel = buildPortfolioItemAccountLabel(item);

  return (
    <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <div className="border-b border-white/8 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea4cf]">
          Portfolio Item
        </p>
        <h4 className="mt-2 text-[1.4rem] font-semibold tracking-tight">
          항목 상세
        </h4>
        <p className="mt-2 text-sm text-[#93a4c7]">
          포트폴리오에서는 집계 결과만 확인하고, 거래와 종목 정보 수정은 원본 화면에서 진행합니다.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <ReadonlyValueBox label="자산군" value={item.groupName} />
        <ReadonlyValueBox label="계좌" value={accountLabel} />
        <ReadonlyValueBox label="연결된 투자 항목" value={`${item.name} (${item.code})`} />

        <div className="grid gap-3 sm:grid-cols-2">
          <ReadonlyValueBox label="이름" value={item.name} />
          <ReadonlyValueBox label="코드" value={item.code} />
          <ReadonlyValueBox label="수량" value={item.quantity} />
          <ReadonlyValueBox label="평단가" value={formatWon(String(item.averagePrice))} />
          <ReadonlyValueBox label="현재가" value={formatWon(String(item.currentPrice))} />
          <ReadonlyValueBox label="수익률" value={<ProfitTone value={item.profitRate} />} />
          <ReadonlyValueBox label="투자금" value={formatWon(String(item.investedAmount))} />
          <ReadonlyValueBox label="평가금" value={formatWon(String(item.marketValue))} />
        </div>

        <div className="rounded-[1rem] border border-[#6ea8fe]/20 bg-[#6ea8fe]/8 px-4 py-3 text-sm leading-6 text-[#cfe1ff]">
          계좌와 수량은 투자일지에서, 종목 이름과 코드는 투자 항목 관리에서 수정됩니다.
        </div>
      </div>
    </Card>
  );
}

function PortfolioItemRow({
  portfolioId,
  item,
  assetGroupOptions,
  accountOptions,
  availableInvestmentItems,
  variant,
}: Readonly<{
  portfolioId: string;
  item: PortfolioItemSummary;
  assetGroupOptions: AssetGroupSummary[];
  accountOptions: AccountSummary[];
  availableInvestmentItems: InvestmentItemOption[];
  variant: "asset-group" | "account";
}>) {
  const accountMetaLabel = buildPortfolioItemAccountLabel(item);
  const meta =
    variant === "asset-group"
      ? [item.code, `수량 ${item.quantity}`, accountMetaLabel]
      : [item.code, item.groupName, `수량 ${item.quantity}`];

  return (
    <div className="grid grid-cols-1 rounded-[1rem] bg-black/15 px-3 py-3 lg:grid-cols-[minmax(0,1.8fr)_132px_132px_88px_24px] lg:items-center lg:gap-5">
      <div className="lg:col-span-4">
        <SettingsDialog
          trigger={
            <button
              type="button"
              className="grid w-full min-w-0 gap-3 text-left lg:grid-cols-[minmax(0,1.8fr)_132px_132px_88px] lg:items-center lg:gap-5"
            >
              <div className="min-w-0 lg:self-center">
                <p className="line-clamp-2 max-w-[22rem] text-[13px] font-semibold leading-5 text-white">
                  {item.name}
                </p>
                <div className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-[#93a4c7]">
                  {meta.filter(Boolean).join(" · ")}
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-3 text-left sm:gap-4 lg:contents">
                <div className="flex min-w-0 flex-col justify-center self-center lg:items-end lg:text-right">
                  <p className="text-[10px] leading-none text-[#93a4c7] lg:hidden">투자금</p>
                  <p className="mt-1 text-[13px] font-semibold tabular-nums text-white lg:mt-0">
                    {formatWon(String(item.investedAmount))}
                  </p>
                </div>
                <div className="flex min-w-0 flex-col justify-center self-center lg:items-end lg:text-right">
                  <p className="text-[10px] leading-none text-[#93a4c7] lg:hidden">평가금</p>
                  <p className="mt-1 text-[13px] font-semibold tabular-nums text-white lg:mt-0">
                    {formatWon(String(item.marketValue))}
                  </p>
                </div>
                <div className="flex min-w-0 flex-col justify-center self-center lg:items-end lg:text-right">
                  <p className="text-[10px] leading-none text-[#93a4c7] lg:hidden">수익률</p>
                  <p className="mt-1 text-[13px] font-semibold tabular-nums lg:mt-0">
                    <ProfitTone value={item.profitRate} />
                  </p>
                </div>
              </div>
            </button>
          }
        >
          {item.isLinkedToInvestmentItem ? (
            <PortfolioItemDetailDialog item={item} />
          ) : (
            <PortfolioItemEditorDialog
              portfolioId={portfolioId}
              item={item}
              assetGroupOptions={assetGroupOptions}
              accountOptions={accountOptions}
              availableInvestmentItems={availableInvestmentItems}
            />
          )}
        </SettingsDialog>
      </div>

      {item.isLinkedToInvestmentItem ? (
        <div className="hidden lg:block" />
      ) : (
        <form action={deletePortfolioItemAction}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="portfolioId" value={portfolioId} />
          <ConfirmSubmitButton
            confirmMessage="이 항목을 삭제하시겠습니까?"
            className={`${itemDeleteButtonClassName} mt-3 lg:mt-0`}
          >
            ×
          </ConfirmSubmitButton>
        </form>
      )}
    </div>
  );
}

function PortfolioItemListHeader() {
  return (
    <div className="hidden items-center gap-5 px-3 pb-2 text-[10px] font-semibold leading-none text-[#93a4c7] lg:grid lg:grid-cols-[minmax(0,1.8fr)_132px_132px_88px_24px]">
      <span>항목</span>
      <span className="text-right">투자금</span>
      <span className="text-right">평가금</span>
      <span className="text-right">수익률</span>
      <span />
    </div>
  );
}

export function PortfolioManagementBoard({
  data,
}: Readonly<{
  data: PortfolioManagementData;
}>) {
  const editableAssetGroups = data.assetGroups.filter((group) => !group.isSynthetic);
  const realAccounts = data.accounts.filter((account) => !account.id.startsWith("__"));
  const cashAccounts = realAccounts.filter((account) => account.cashBalance > 0);
  const accountManagementHref = `/accounts?${new URLSearchParams({
    portfolio: data.portfolio.id,
  }).toString()}`;

  return (
    <div className="space-y-6">
      <Card className="text-white">
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
              Portfolio Control
            </p>
            <SettingsDialog
              trigger={
                <button
                  type="button"
                  className="group mt-2 inline-flex appearance-none items-center border-0 bg-transparent p-0 text-left"
                >
                  <span className="block text-2xl font-semibold leading-tight tracking-tight text-white transition group-hover:text-[#8fb0ec]">
                    {data.portfolio.name}
                  </span>
                </button>
              }
            >
              <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] p-5 text-white shadow-[0_14px_40px_rgba(0,0,0,.28)] sm:p-6">
                <div className="pr-14">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
                    Portfolio
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{data.portfolio.name}</h3>
                </div>
                <form action={updatePortfolioAction} className="mt-6 space-y-4">
                  <input type="hidden" name="id" value={data.portfolio.id} />
                  <input
                    type="hidden"
                    name="returnTo"
                    value={`/portfolios?${new URLSearchParams({
                      portfolio: data.portfolio.id,
                      status: "portfolio-updated",
                    }).toString()}`}
                  />
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium">이름</span>
                    <Input
                      name="name"
                      defaultValue={data.portfolio.name}
                      required
                      className={`${fieldClassName} py-2.5`}
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium">설명</span>
                    <Textarea
                      name="description"
                      defaultValue={data.portfolio.description ?? ""}
                      className={`${fieldClassName} min-h-24 py-2.5`}
                    />
                  </label>
                  <SubmitButton className="w-full" pendingLabel="포트폴리오 저장 중...">
                    저장
                  </SubmitButton>
                </form>
              </Card>
            </SettingsDialog>
            {data.portfolio.description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8fb0ec]">
                {data.portfolio.description}
              </p>
            ) : null}
          </div>

          <div className="flex max-w-full flex-wrap gap-2">
            <form action={recordPortfolioSnapshotAction}>
              <input type="hidden" name="portfolioId" value={data.portfolio.id} />
              <button type="submit" className={boardActionButtonClassName}>
                스냅샷 기록
              </button>
            </form>
            <SettingsDialog
              dialogClassName="max-w-[min(92vw,52rem)]"
              trigger={
                <button type="button" className={boardActionButtonClassName}>
                  스냅샷 보기
                </button>
              }
            >
              <PortfolioSnapshotHistory
                snapshots={data.snapshots}
                className="w-[min(92vw,52rem)] max-h-[80vh] overflow-y-auto rounded-[22px]"
              />
            </SettingsDialog>
          </div>
        </div>

        <div className="desktop-kpi-grid-4 mt-6 min-w-0">
            <SummaryBox label="총 투자금" value={formatWon(String(data.summary.investedAmount))} />
            <SummaryBox label="총 평가금" value={formatWon(String(data.summary.marketValue))} />
            <SummaryBox
              label="총 수익금"
              value={<ProfitTone value={data.summary.profitAmount} suffix="won" />}
            />
            <SummaryBox
              label="총 수익률"
              value={<ProfitTone value={data.summary.profitRate} />}
            />
        </div>
      </Card>

      <Card className="text-white">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
              Portfolio Dashboard
            </p>
            <div className="mt-2 flex h-auto flex-wrap items-center gap-3">
              <h3 className="text-2xl font-semibold tracking-tight text-white">포트폴리오 상세</h3>
              <Link
                href={accountManagementHref}
                className="inline-flex h-8 items-center rounded-full border border-[rgba(110,168,254,0.28)] bg-[rgba(110,168,254,0.12)] px-3 text-[12px] font-semibold text-[#cfe1ff] transition hover:bg-[rgba(110,168,254,0.18)]"
              >
                계좌 관리
              </Link>
              <SettingsDialog
                trigger={
                  <button
                    type="button"
                    className={boardInlineAddButtonClassName}
                    aria-label="자산군 추가 열기"
                  >
                    +
                  </button>
                }
              >
                <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
                  <h4 className="text-xl font-semibold">자산군 추가</h4>
                  <form action={createPortfolioAssetGroupAction} className="mt-5 space-y-4">
                    <input type="hidden" name="portfolioId" value={data.portfolio.id} />
                    <input type="hidden" name="sortOrder" value={editableAssetGroups.length} />
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_9.5rem] md:items-start">
                      <PortfolioAssetGroupSelector fieldClassName={fieldClassName} />
                      <label className="space-y-1.5">
                        <span className="text-sm font-medium">초기 비중</span>
                        <Input
                          name="targetWeight"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          defaultValue={editableAssetGroups.length === 0 ? "100" : "0"}
                          className={`${fieldClassName} py-2.5`}
                        />
                      </label>
                    </div>
                    <SubmitButton className="w-full" pendingLabel="자산군 저장 중...">
                      자산군 추가
                    </SubmitButton>
                  </form>
                </Card>
              </SettingsDialog>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#93a4c7]">
              자산군 비중과 포트폴리오 항목 배치를 이 화면에서 관리하고, 계좌 등록과 불러오기는 별도 계좌 관리로 분리했습니다.
            </p>
          </div>
        </div>

        {realAccounts.length === 0 ? (
          <div className="mt-5 rounded-[1rem] border border-dashed border-[#8fb6ff]/24 bg-[#8fb6ff]/8 px-4 py-4 text-sm leading-6 text-[#cfe1ff]">
            등록된 실계좌가 없습니다. 포트폴리오 항목은 계좌 없이도 배치할 수 있지만, 거래 기록과 계좌별 집계는
            <Link href={accountManagementHref} className="ml-1 font-semibold underline underline-offset-4">
              계좌 관리
            </Link>
            에서 계좌를 등록한 뒤 사용하는 것이 더 자연스럽습니다.
          </div>
        ) : null}

        <div className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            {data.assetGroups.map((group) => {
              const isCashGroup = group.name === "현금";
              const isResidualGroup = isResidualAssetGroupName(group.name);
              const visibleItemCount = isCashGroup ? cashAccounts.length : group.items.length;

              return (
                <article
                  key={group.id}
                  className="overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
                >
                  <div className="border-b border-white/8 px-5 py-2.5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[1rem] border border-white/8 bg-[rgba(255,255,255,0.09)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                          <AssetGroupIcon name={group.name} />
                        </div>
                        <div className="min-w-0 self-center">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-[1.15rem] font-semibold leading-none tracking-tight text-white">
                              {group.name}
                            </h4>
                            {isResidualGroup ? (
                              <span className="rounded-full border border-[#8fb6ff]/22 bg-[#8fb6ff]/12 px-3 py-1 text-xs font-semibold text-[#dce7ff]">
                                잔여 비중
                              </span>
                            ) : null}
                            {group.isSynthetic ? (
                              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#cdd9f2]">
                                자동 계산
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start lg:self-center">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#cdd9f2]">
                          {visibleItemCount}개 항목
                        </span>
                        {!group.isSynthetic && !isResidualGroup ? (
                          <form action={deletePortfolioAssetGroupAction}>
                            <input type="hidden" name="id" value={group.id} />
                            <input type="hidden" name="portfolioId" value={data.portfolio.id} />
                            <ConfirmSubmitButton
                              confirmMessage="이 자산군을 삭제하시겠습니까? 연결된 항목은 미분류 상태로 유지됩니다."
                              className={itemDeleteButtonClassName}
                            >
                              ×
                            </ConfirmSubmitButton>
                          </form>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 px-5 py-4">
                    <div className="desktop-kpi-grid-5">
                      {group.isSynthetic || isResidualGroup ? (
                        <div className={assetGroupMetricCardClassName}>
                          <p className="text-[10px] text-[#93a4c7]">비중</p>
                          <p className="mt-1.5 break-all text-[0.92rem] font-bold tracking-tight text-white sm:whitespace-nowrap">
                            {formatPercent(group.targetWeight)} / {formatPercent(group.currentWeight)}
                          </p>
                        </div>
                      ) : (
                        <SettingsDialog
                          trigger={
                            <button
                              type="button"
                              className={`${assetGroupMetricCardClassName} w-full text-left transition hover:bg-black/20`}
                            >
                              <p className="text-[10px] text-[#93a4c7]">비중</p>
                              <p className="mt-1.5 break-all text-[0.92rem] font-bold tracking-tight text-white sm:whitespace-nowrap">
                                {formatPercent(group.targetWeight)} / {formatPercent(group.currentWeight)}
                              </p>
                            </button>
                          }
                        >
                          <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
                            <div className="border-b border-white/8 pb-4">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea4cf]">
                                Asset Group
                              </p>
                              <h4 className="mt-2 text-[1.4rem] font-semibold tracking-tight">
                                자산군 수정
                              </h4>
                            </div>
                            <form action={updatePortfolioAssetGroupAction} className="mt-5 space-y-4">
                              <input type="hidden" name="id" value={group.id} />
                              <input type="hidden" name="portfolioId" value={data.portfolio.id} />
                              <input type="hidden" name="sortOrder" value={0} />
                              <input type="hidden" name="name" value={group.name} />
                              <label className="space-y-1.5">
                                <span className="text-sm font-medium">목표 비중</span>
                                <Input
                                  name="targetWeight"
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  defaultValue={String(group.targetWeight)}
                                  className={`${fieldClassName} py-2.5`}
                                />
                              </label>
                              <SubmitButton className="w-full" pendingLabel="저장 중...">
                                저장
                              </SubmitButton>
                            </form>
                          </Card>
                        </SettingsDialog>
                      )}
                      <div className={assetGroupMetricCardClassName}>
                        <p className="text-[10px] text-[#93a4c7]">투자금</p>
                        <p className="mt-1.5 break-all text-[0.92rem] font-semibold tracking-tight text-white sm:whitespace-nowrap">
                          {formatWon(String(group.investedAmount))}
                        </p>
                      </div>
                      <div className={assetGroupMetricCardClassName}>
                        <p className="text-[10px] text-[#93a4c7]">평가금</p>
                        <p className="mt-1.5 break-all text-[0.92rem] font-semibold tracking-tight text-white sm:whitespace-nowrap">
                          {formatWon(String(group.marketValue))}
                        </p>
                      </div>
                      <div className={assetGroupMetricCardClassName}>
                        <p className="text-[10px] text-[#93a4c7]">수익률</p>
                        <p className="mt-1.5 break-all text-[0.92rem] font-semibold tracking-tight sm:whitespace-nowrap">
                          <ProfitTone value={group.profitRate} />
                        </p>
                      </div>
                      <div className={assetGroupMetricCardClassName}>
                        <p className="text-[10px] text-[#93a4c7]">리밸런싱</p>
                        <p className="mt-1.5 break-all text-[0.92rem] font-semibold tracking-tight sm:whitespace-nowrap">
                          {group.buyAmount > 0 ? (
                            <span className="text-[#ff8e8e]">+{formatWon(String(group.buyAmount))}</span>
                          ) : group.sellAmount > 0 ? (
                            <span className="text-[#8fb6ff]">-{formatWon(String(group.sellAmount))}</span>
                          ) : (
                            <span className="text-white">-</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <details open className="rounded-2xl border border-white/8">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">항목</h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#93a4c7]">{visibleItemCount}개</span>
                          {!group.isSynthetic ? (
                            <SettingsDialog
                              stopPropagationOnTriggerClick
                              trigger={
                                <button
                                  type="button"
                                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold leading-none text-[#dce7ff] transition hover:bg-white/10"
                                  aria-label="항목 추가"
                                >
                                  +
                                </button>
                              }
                            >
                              <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
                                <div className="border-b border-white/8 pb-4">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea4cf]">
                                    Portfolio Item
                                  </p>
                                  <h4 className="mt-2 text-[1.4rem] font-semibold tracking-tight">
                                    항목 추가
                                  </h4>
                                  <p className="mt-2 text-sm text-[#93a4c7]">
                                    {group.name} 자산군에 포트폴리오 항목을 추가합니다.
                                  </p>
                                </div>
                                <PortfolioItemCreateForm
                                  portfolioId={data.portfolio.id}
                                  portfolioAssetGroupId={group.id}
                                  accountOptions={realAccounts}
                                  assetGroupOptions={editableAssetGroups}
                                  availableInvestmentItems={data.availableInvestmentItems}
                                  sortOrder={data.portfolioItems.length}
                                />
                              </Card>
                            </SettingsDialog>
                          ) : null}
                        </div>
                      </summary>
                      <div className="border-t border-white/8 p-4">
                        {isCashGroup ? (
                          cashAccounts.length === 0 ? (
                            <div className="rounded-2xl bg-black/15 p-4 text-sm text-[#93a4c7]">
                              현금 잔액이 등록된 계좌가 없습니다.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {cashAccounts.map((account) => (
                                <div
                                  key={`cash-${account.id}`}
                                  className="rounded-[1rem] bg-black/15 px-3 py-3 text-sm"
                                >
                                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="min-w-0">
                                      <p className="line-clamp-1 max-w-[22rem] text-[13px] font-medium leading-5 text-white">
                                        {getAccountTitle(account)} 현금
                                      </p>
                                      {getAccountMeta(account) ? (
                                        <div className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-[#93a4c7]">
                                          {getAccountMeta(account)}
                                        </div>
                                      ) : null}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                                      <div className="text-right">
                                        <p className="text-[10px] text-[#93a4c7]">평가금</p>
                                        <p className="text-[13px] font-medium text-white">
                                          {formatWon(String(account.cashBalance))}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-[10px] text-[#93a4c7]">현재비중</p>
                                        <p className="text-[13px] font-medium text-white">
                                          {formatPercent(account.currentWeight)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        ) : group.items.length === 0 ? (
                          <div className="rounded-2xl bg-black/15 p-4 text-sm text-[#93a4c7]">
                            현재 연결된 항목 데이터가 없습니다.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <PortfolioItemListHeader />
                            {group.items.map((item) => (
                              <PortfolioItemRow
                                key={item.id}
                                portfolioId={data.portfolio.id}
                                item={item}
                                assetGroupOptions={editableAssetGroups}
                                accountOptions={realAccounts}
                                availableInvestmentItems={data.availableInvestmentItems}
                                variant="asset-group"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </details>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
