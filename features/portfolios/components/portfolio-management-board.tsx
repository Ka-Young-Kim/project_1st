import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { createPortfolioAccountAction } from "@/features/portfolios/actions/create-portfolio-account";
import { createPortfolioAssetGroupAction } from "@/features/portfolios/actions/create-portfolio-asset-group";
import { deletePortfolioAccountAction } from "@/features/portfolios/actions/delete-portfolio-account";
import { deletePortfolioAssetGroupAction } from "@/features/portfolios/actions/delete-portfolio-asset-group";
import { recordPortfolioSnapshotAction } from "@/features/portfolios/actions/record-portfolio-snapshot";
import { updatePortfolioAccountAction } from "@/features/portfolios/actions/update-portfolio-account";
import { updatePortfolioAssetGroupAction } from "@/features/portfolios/actions/update-portfolio-asset-group";
import { PortfolioHoldingBulkAssignForm } from "@/features/portfolios/components/portfolio-holding-bulk-assign-form";
import { PORTFOLIO_ASSET_GROUP_OPTIONS } from "@/features/portfolios/lib/asset-group";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { formatDisplayDate, formatWon } from "@/lib/utils";
import type { PortfolioManagementData } from "@/features/portfolios/services/portfolio-management-service";

const fieldClassName =
  "appearance-none border-white/12 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";

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
  const text =
    suffix === "%"
      ? formatPercent(value)
      : formatWon(String(value));

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
      <svg viewBox="0 0 24 24" className={`h-7 w-7 ${tone}`} fill="none" aria-hidden="true">
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

function AccountDetailTable({
  account,
}: Readonly<{
  account: PortfolioManagementData["accounts"][number];
}>) {
  const hasCash = account.cashTrackingEnabled && account.cashBalance > 0;
  const hasRows = account.items.length > 0 || hasCash;

  if (!hasRows) {
    return null;
  }

  return (
    <div className="mt-4 overflow-hidden rounded-[1rem] border border-white/8 bg-black/15">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <p className="text-sm font-semibold text-[#dce7ff]">계좌별 상세</p>
        <span className="text-xs text-[#93a4c7]">
          보유 종목 {account.items.length}개
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-black/20 text-[#9cb0d8]">
            <tr>
              <th className="px-3 py-2.5 text-left font-semibold">종목명</th>
              <th className="px-3 py-2.5 text-left font-semibold">자산군</th>
              <th className="px-3 py-2.5 text-right font-semibold">수량</th>
              <th className="px-3 py-2.5 text-right font-semibold">투자금</th>
              <th className="px-3 py-2.5 text-right font-semibold">평가금</th>
              <th className="px-3 py-2.5 text-right font-semibold">수익률</th>
            </tr>
          </thead>
          <tbody>
            {account.items.map((item) => (
              <tr key={`${account.id}-${item.code}`} className="border-t border-white/8">
                <td className="px-3 py-3">
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="mt-1 text-xs text-[#93a4c7]">{item.code}</p>
                  </div>
                </td>
                <td className="px-3 py-3 text-[#cfe1ff]">{item.groupName}</td>
                <td className="px-3 py-3 text-right">{item.quantity}</td>
                <td className="px-3 py-3 text-right">{formatWon(String(item.investedAmount))}</td>
                <td className="px-3 py-3 text-right">{formatWon(String(item.marketValue))}</td>
                <td className="px-3 py-3 text-right">
                  <ProfitTone value={item.profitRate} />
                </td>
              </tr>
            ))}
            {hasCash ? (
              <tr className="border-t border-white/8 bg-white/[0.03]">
                <td className="px-3 py-3">
                  <div>
                    <p className="font-medium text-white">현금</p>
                    <p className="mt-1 text-xs text-[#93a4c7]">Cash balance</p>
                  </div>
                </td>
                <td className="px-3 py-3 text-[#cfe1ff]">현금</td>
                <td className="px-3 py-3 text-right">-</td>
                <td className="px-3 py-3 text-right">{formatWon(String(account.cashBalance))}</td>
                <td className="px-3 py-3 text-right">{formatWon(String(account.cashBalance))}</td>
                <td className="px-3 py-3 text-right">0%</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PortfolioManagementBoard({
  data,
}: Readonly<{
  data: PortfolioManagementData;
}>) {
  const editableAssetGroups = data.assetGroups.filter((group) => !group.isSynthetic);
  const unlinkedItems = data.managedItems.filter((item) => !item.isLinked);
  const cashAccounts = data.accounts.filter((account) => account.cashTrackingEnabled);

  return (
    <div className="space-y-6">
      <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
              Portfolio Control
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              {data.portfolio.name}
            </h2>
            {data.portfolio.description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8fb0ec]">
                {data.portfolio.description}
              </p>
            ) : null}
          </div>

          <form action={recordPortfolioSnapshotAction}>
            <input type="hidden" name="portfolioId" value={data.portfolio.id} />
            <SubmitButton
              className="min-w-[11rem]"
              pendingLabel="스냅샷 기록 중..."
            >
              스냅샷 기록
            </SubmitButton>
          </form>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
              Portfolio Dashboard
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              자산군 + 보유 종목 통합 카드
            </h3>
            <p className="mt-2 text-sm text-[#93a4c7]">
              자산 배분 정보와 보유 종목을 같은 카드 안에서 함께 보는 형태로 정리했습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SettingsDialog
              trigger={
                <button
                  type="button"
                  className="rounded-2xl border border-[var(--border)] bg-white/4 px-4 py-2 text-sm font-semibold text-[#dce7ff] transition hover:bg-white/8"
                >
                  자산군 추가
                </button>
              }
            >
              <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
                <h4 className="text-xl font-semibold">자산군 추가</h4>
                <form action={createPortfolioAssetGroupAction} className="mt-5 space-y-4">
                  <input type="hidden" name="portfolioId" value={data.portfolio.id} />
                  <input type="hidden" name="sortOrder" value={data.assetGroups.length} />
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium">자산군</span>
                    <Select
                      name="name"
                      defaultValue=""
                      className={`${fieldClassName} py-2.5 [&>option]:bg-[#15203a] [&>option]:text-white`}
                    >
                      <option value="" disabled className="bg-[#15203a] text-white">
                        자산군 선택
                      </option>
                      {PORTFOLIO_ASSET_GROUP_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-[#15203a] text-white"
                        >
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </label>
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
                  <SubmitButton className="w-full" pendingLabel="자산군 저장 중...">
                    자산군 추가
                  </SubmitButton>
                </form>
              </Card>
            </SettingsDialog>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {data.assetGroups.map((group) => (
              (() => {
                const isCashGroup = group.name === "현금";
                const visibleItemCount = isCashGroup ? cashAccounts.length : group.items.length;

                return (
              <article
                key={group.id}
                className="overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
              >
                <div className="border-b border-white/8 px-5 py-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[1.2rem] border border-white/8 bg-[rgba(255,255,255,0.09)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                        <AssetGroupIcon name={group.name} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-[1.25rem] font-semibold leading-none tracking-tight text-white">
                            {group.name}
                          </h4>
                          {group.isSynthetic ? (
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#cdd9f2]">
                              자동 계산
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-[0.85rem] text-[#8fa6c7]">
                          목표 비중 {formatPercent(group.targetWeight)} · 현재 비중 {formatPercent(group.currentWeight)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#cdd9f2]">
                          {visibleItemCount}개 항목
                        </span>
                      {!group.isSynthetic ? (
                        <SettingsDialog
                          trigger={
                            <button
                              type="button"
                              className="rounded-2xl border border-white/10 bg-white/4 px-4 py-2 text-sm font-semibold text-[#dce7ff] transition hover:bg-white/8"
                            >
                              수정
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
                              <p className="mt-2 text-sm text-[#93a4c7]">
                                {group.name} 자산군에 비중을 조정하고 항목을 수정합니다.
                              </p>
                            </div>

                            <form
                              id={`asset-group-update-${group.id}`}
                              action={updatePortfolioAssetGroupAction}
                              className="mt-5 space-y-4"
                            >
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
                            </form>
                            {unlinkedItems.length > 0 ? (
                              <PortfolioHoldingBulkAssignForm
                                portfolioId={data.portfolio.id}
                                portfolioAssetGroupId={group.id}
                                groupName={group.name}
                                options={unlinkedItems.map((item) => ({
                                  id: item.id,
                                  name: item.name,
                                  code: item.code,
                                }))}
                                accountOptions={data.accounts
                                  .filter((account) => !account.id.startsWith("__"))
                                  .map((account) => ({
                                    id: account.id,
                                    name: account.name,
                                    displayId: account.displayId,
                                  }))}
                                fieldClassName={fieldClassName}
                              />
                            ) : (
                              <div className="mt-4 rounded-[1rem] border border-white/8 bg-black/10 px-4 py-3 text-sm text-[#93a4c7]">
                                모든 투자 항목이 이미 자산군에 배치되어 있습니다.
                              </div>
                            )}
                            <div className="mt-7 border-t border-white/8 pt-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8ea4cf]">
                                Danger Zone
                              </p>
                              <p className="mt-2 max-w-[26rem] text-xs leading-5 text-[#93a4c7]">
                                자산군을 삭제하면 연결된 항목은 미분류 상태로 이동합니다.
                              </p>
                            </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <button
                                type="submit"
                                form={`asset-group-update-${group.id}`}
                                className="inline-flex w-full items-center justify-center rounded-[1rem] bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
                              >
                                  저장
                              </button>
                              <form action={deletePortfolioAssetGroupAction}>
                                <input type="hidden" name="id" value={group.id} />
                                <input type="hidden" name="portfolioId" value={data.portfolio.id} />
                                <ConfirmSubmitButton
                                  confirmMessage="이 자산군을 삭제하시겠습니까? 연결 항목은 미분류로 이동합니다."
                                  className="w-full rounded-[1rem] border border-rose-300/30 bg-[linear-gradient(180deg,rgba(190,24,93,0.12),rgba(190,24,93,0.06))] px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-[linear-gradient(180deg,rgba(190,24,93,0.18),rgba(190,24,93,0.1))]"
                                >
                                  삭제
                                </ConfirmSubmitButton>
                              </form>
                            </div>
                          </Card>
                        </SettingsDialog>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 px-5 py-4">
                  <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
                    <div className="rounded-[1.2rem] bg-black/15 p-3">
                      <p className="text-[10px] text-[#93a4c7]">비중</p>
                      <p className="mt-1.5 text-[1.05rem] font-bold text-white">
                        {formatPercent(group.targetWeight)} / {formatPercent(group.currentWeight)}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] bg-black/15 p-3">
                      <p className="text-[10px] text-[#93a4c7]">투자금</p>
                      <p className="mt-1.5 text-[1.05rem] font-semibold text-white">
                        {formatWon(String(group.investedAmount))}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] bg-black/15 p-3">
                      <p className="text-[10px] text-[#93a4c7]">평가금</p>
                      <p className="mt-1.5 text-[1.05rem] font-semibold text-white">
                        {formatWon(String(group.marketValue))}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] bg-black/15 p-3">
                      <p className="text-[10px] text-[#93a4c7]">수익률</p>
                      <p className="mt-1.5 text-[1.05rem] font-semibold">
                        <ProfitTone value={group.profitRate} />
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] bg-black/15 p-3">
                      <p className="text-[10px] text-[#93a4c7]">리밸런싱</p>
                      <p className="mt-1.5 text-[1.05rem] font-semibold">
                        {group.buyAmount > 0 ? (
                          <span className="text-[#7cf2c9]">+{formatWon(String(group.buyAmount))}</span>
                        ) : group.sellAmount > 0 ? (
                          <span className="text-[#ff8e8e]">-{formatWon(String(group.sellAmount))}</span>
                        ) : (
                          <span className="text-white">-</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <details className="rounded-2xl border border-white/8">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                      <div>
                        <h4 className="font-semibold text-white">보유 종목</h4>
                        <p className="mt-0.5 text-xs text-[#93a4c7]">카테고리 상세</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#93a4c7]">{visibleItemCount}개</span>
                        <span className="text-sm text-[#cdd9f2]">접어두기</span>
                      </div>
                    </summary>
                    <div className="border-t border-white/8 p-4">
                      {isCashGroup ? (
                        cashAccounts.length === 0 ? (
                          <div className="rounded-2xl bg-black/15 p-4 text-sm text-[#93a4c7]">
                            현금 추적이 켜진 계좌가 없습니다.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {cashAccounts.map((account) => (
                              <div
                                key={`cash-${account.id}`}
                                className="flex flex-col gap-3 rounded-[1rem] bg-black/15 px-3 py-3 text-sm lg:flex-row lg:items-center lg:justify-between"
                              >
                                <div className="min-w-0">
                                  <p className="line-clamp-1 max-w-[22rem] text-[13px] font-medium leading-5 text-white">
                                    {account.name} 현금
                                  </p>
                                  <div className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-[#93a4c7]">
                                    {account.displayId ? `${account.displayId} · ` : ""}
                                    현금 추적 계좌
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                                  <div className="text-right">
                                    <p className="text-[10px] text-[#93a4c7]">투자금</p>
                                    <p className="text-[13px] font-medium text-white">
                                      {formatWon(String(account.cashBalance))}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] text-[#93a4c7]">평가금</p>
                                    <p className="text-[13px] font-medium text-white">
                                      {formatWon(String(account.cashBalance))}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] text-[#93a4c7]">수익률</p>
                                    <p className="text-[13px] font-semibold text-white">0%</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      ) : group.items.length === 0 ? (
                        <div className="rounded-2xl bg-black/15 p-4 text-sm text-[#93a4c7]">
                          현재 연결된 보유 종목 데이터가 없습니다.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {group.items.map((item) => (
                            <div
                              key={item.investmentItemId}
                              className="flex flex-col gap-3 rounded-[1rem] bg-black/15 px-3 py-3 text-sm lg:flex-row lg:items-center lg:justify-between"
                            >
                              <div className="min-w-0">
                                <p className="line-clamp-2 max-w-[22rem] text-[13px] font-medium leading-5 text-white">
                                  {item.name}
                                </p>
                                <div className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-[#93a4c7]">
                                  {item.code} · 수량 {item.quantity}
                                  {item.accounts.length > 0
                                    ? ` · ${item.accounts
                                        .map((account) =>
                                          account.displayId
                                            ? `${account.name} (${account.displayId})`
                                            : account.name,
                                        )
                                        .join(", ")}`
                                    : ""}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                                <div className="text-right">
                                  <p className="text-[10px] text-[#93a4c7]">투자금</p>
                                  <p className="text-[13px] font-medium text-white">
                                    {formatWon(String(item.investedAmount))}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] text-[#93a4c7]">평가금</p>
                                  <p className="text-[13px] font-medium text-white">
                                    {formatWon(String(item.marketValue))}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] text-[#93a4c7]">수익률</p>
                                  <p className="text-[13px] font-semibold">
                                    <ProfitTone value={item.profitRate} />
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              </article>
                );
              })()
            ))}
          </div>

        </div>
      </Card>

      <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
              Accounts
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">계좌 요약</h3>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone="done" compact>
              {data.accounts.length}개
            </Badge>
            <SettingsDialog
              trigger={
                <button
                  type="button"
                  className="rounded-full border border-[var(--border)] bg-white/4 px-4 py-2 text-sm font-semibold text-[#dce7ff] transition hover:bg-white/8"
                >
                  계좌 추가
                </button>
              }
            >
              <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
                <h4 className="text-xl font-semibold">새 계좌 추가</h4>
                <form action={createPortfolioAccountAction} className="mt-5 space-y-4">
                  <input type="hidden" name="portfolioId" value={data.portfolio.id} />
                  <input type="hidden" name="sortOrder" value={data.accounts.length} />
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium">계좌명</span>
                    <Input name="name" required className={`${fieldClassName} py-2.5`} />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium">계좌 식별정보</span>
                    <Input name="displayId" className={`${fieldClassName} py-2.5`} />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium">현금 잔액</span>
                    <Input
                      name="cashBalance"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue="0"
                      className={`${fieldClassName} py-2.5`}
                    />
                  </label>
                  <label className="inline-flex items-center gap-3 rounded-[1rem] border border-white/8 bg-white/4 px-4 py-3 text-sm text-white/88">
                    <input type="checkbox" name="cashTrackingEnabled" className="h-4 w-4 accent-[#6ea8fe]" />
                    현금 추적 사용
                  </label>
                  <SubmitButton className="w-full" pendingLabel="계좌 저장 중...">
                    계좌 추가
                  </SubmitButton>
                </form>
              </Card>
            </SettingsDialog>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {data.accounts.length === 0 ? (
            <EmptyState
              title="등록된 계좌가 없습니다"
              description="우측 상단 버튼으로 첫 계좌를 추가하세요."
            />
          ) : (
            data.accounts.map((account) => (
              <article
                key={account.id}
                className="rounded-[1.2rem] border border-[var(--border)] bg-white/4 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">{account.name}</p>
                      {account.id.startsWith("__") ? (
                        <Badge tone="info" compact>
                          자동 구분
                        </Badge>
                      ) : null}
                    </div>
                    {account.displayId ? (
                      <p className="mt-1 text-xs text-[#93a4c7]">{account.displayId}</p>
                    ) : null}
                  </div>
                  {!account.id.startsWith("__") ? (
                    <div className="flex gap-2">
                      <SettingsDialog
                        trigger={
                          <button
                            type="button"
                            className="rounded-full border border-[var(--border)] bg-white/4 px-4 py-2 text-sm font-semibold text-[#cfe1ff] transition hover:bg-white/8"
                          >
                            수정
                          </button>
                        }
                      >
                        <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
                          <h4 className="text-xl font-semibold">계좌 수정</h4>
                          <form action={updatePortfolioAccountAction} className="mt-5 space-y-4">
                            <input type="hidden" name="id" value={account.id} />
                            <input type="hidden" name="portfolioId" value={data.portfolio.id} />
                            <input type="hidden" name="sortOrder" value={0} />
                            <label className="space-y-1.5">
                              <span className="text-sm font-medium">계좌명</span>
                              <Input
                                name="name"
                                defaultValue={account.name}
                                required
                                className={`${fieldClassName} py-2.5`}
                              />
                            </label>
                            <label className="space-y-1.5">
                              <span className="text-sm font-medium">계좌 식별정보</span>
                              <Input
                                name="displayId"
                                defaultValue={account.displayId}
                                className={`${fieldClassName} py-2.5`}
                              />
                            </label>
                            <label className="inline-flex items-center gap-3 rounded-[1rem] border border-white/8 bg-black/10 px-4 py-3 text-sm text-white/88">
                              <input
                                type="checkbox"
                                name="cashTrackingEnabled"
                                defaultChecked={account.cashTrackingEnabled}
                                className="h-4 w-4 accent-[#6ea8fe]"
                              />
                              현금 추적 사용
                            </label>
                            <label className="space-y-1.5">
                              <span className="text-sm font-medium">현금 잔액</span>
                              <Input
                                name="cashBalance"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={String(account.cashBalance)}
                                className={`${fieldClassName} py-2.5`}
                              />
                            </label>
                            <SubmitButton className="w-full" pendingLabel="저장 중...">
                              계좌 저장
                            </SubmitButton>
                          </form>
                          <form action={deletePortfolioAccountAction} className="mt-3">
                            <input type="hidden" name="id" value={account.id} />
                            <input type="hidden" name="portfolioId" value={data.portfolio.id} />
                            <ConfirmSubmitButton
                              confirmMessage="이 계좌를 삭제하시겠습니까?"
                              className="w-full rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                            >
                              삭제
                            </ConfirmSubmitButton>
                          </form>
                        </Card>
                      </SettingsDialog>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <SummaryBox label="평가금" value={formatWon(String(account.marketValue))} />
                  <SummaryBox label="투자금" value={formatWon(String(account.investedAmount))} />
                  <SummaryBox label="현재비중" value={formatPercent(account.currentWeight)} />
                </div>

                <AccountDetailTable account={account} />
              </article>
            ))
          )}
        </div>
      </Card>

      <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
          History
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">스냅샷 히스토리</h3>

        <div className="mt-5 space-y-3">
          {data.snapshots.length === 0 ? (
            <EmptyState
              title="아직 스냅샷이 없습니다"
              description="상단 버튼으로 오늘 포트폴리오 상태를 기록하세요."
            />
          ) : (
            data.snapshots.map((snapshot) => (
              <article
                key={snapshot.id}
                className="rounded-[1.2rem] border border-[var(--border)] bg-white/4 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {formatDisplayDate(snapshot.snapshotDate)}
                    </p>
                    <p className="mt-1 text-xs text-[#93a4c7]">
                      계좌 {snapshot.accountCount}개, 자산군 {snapshot.assetGroupCount}개
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#93a4c7]">
                      평가금 {formatWon(String(snapshot.marketValue))}
                    </p>
                    <p className="mt-1 text-sm">
                      <ProfitTone value={snapshot.profitRate} />
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function SummaryBox({
  label,
  value,
}: Readonly<{
  label: string;
  value: React.ReactNode;
}>) {
  return (
    <div className="rounded-[1.1rem] border border-[var(--border)] bg-white/4 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
        {label}
      </p>
      <div className="mt-2 text-[1.05rem] font-semibold tracking-tight text-white">{value}</div>
    </div>
  );
}
