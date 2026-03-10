import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createPortfolioAccountAction } from "@/features/portfolios/actions/create-portfolio-account";
import { createPortfolioAssetGroupAction } from "@/features/portfolios/actions/create-portfolio-asset-group";
import { deletePortfolioAccountAction } from "@/features/portfolios/actions/delete-portfolio-account";
import { deletePortfolioAssetGroupAction } from "@/features/portfolios/actions/delete-portfolio-asset-group";
import { recordPortfolioSnapshotAction } from "@/features/portfolios/actions/record-portfolio-snapshot";
import { savePortfolioTargetsAction } from "@/features/portfolios/actions/save-portfolio-targets";
import { updatePortfolioAccountAction } from "@/features/portfolios/actions/update-portfolio-account";
import { updatePortfolioAssetGroupAction } from "@/features/portfolios/actions/update-portfolio-asset-group";
import { updatePortfolioHoldingAction } from "@/features/portfolios/actions/update-portfolio-holding";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { formatDisplayDate, formatMoney, formatWon } from "@/lib/utils";
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

export function PortfolioManagementBoard({
  data,
}: Readonly<{
  data: PortfolioManagementData;
}>) {
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

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
                Accounts
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">계좌 요약</h3>
            </div>
            <Badge tone="done" compact>
              {data.accounts.length}개
            </Badge>
          </div>

          <div className="mt-5 space-y-3">
            {data.accounts.length === 0 ? (
              <EmptyState
                title="등록된 계좌가 없습니다"
                description="아래에서 첫 계좌를 추가하세요."
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
                    <MetricItem label="평가금" value={formatWon(String(account.marketValue))} />
                    <MetricItem label="투자금" value={formatWon(String(account.investedAmount))} />
                    <MetricItem label="현재비중" value={formatPercent(account.currentWeight)} />
                  </div>
                </article>
              ))
            )}
          </div>

          <form action={createPortfolioAccountAction} className="mt-5 rounded-[1.25rem] border border-dashed border-white/10 bg-black/10 p-4">
            <input type="hidden" name="portfolioId" value={data.portfolio.id} />
            <input type="hidden" name="sortOrder" value={data.accounts.length} />
            <h4 className="text-lg font-semibold">새 계좌 추가</h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
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
            </div>
            <SubmitButton className="mt-4 w-full" pendingLabel="계좌 저장 중...">
              계좌 추가
            </SubmitButton>
          </form>
        </Card>

        <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
                Rebalancing
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                자산군 비율과 리밸런싱
              </h3>
            </div>
            <Badge tone="info" compact>
              총 현금 {formatWon(String(data.summary.cashValue))}
            </Badge>
          </div>

          <form action={savePortfolioTargetsAction} className="mt-5 overflow-hidden rounded-[1.25rem] border border-[var(--border)]">
            <input type="hidden" name="portfolioId" value={data.portfolio.id} />
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-black/20 text-[#9cb0d8]">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold">자산군</th>
                    <th className="px-3 py-3 text-right font-semibold">세팅비중</th>
                    <th className="px-3 py-3 text-right font-semibold">투자금</th>
                    <th className="px-3 py-3 text-right font-semibold">평가금</th>
                    <th className="px-3 py-3 text-right font-semibold">현재비중</th>
                    <th className="px-3 py-3 text-right font-semibold">매수 필요</th>
                    <th className="px-3 py-3 text-right font-semibold">매도 필요</th>
                  </tr>
                </thead>
                <tbody>
                  {data.assetGroups.map((group) => (
                    <tr key={group.id} className="border-t border-white/8">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{group.name}</span>
                          {group.isSynthetic ? (
                            <Badge tone="info" compact>
                              자동
                            </Badge>
                          ) : null}
                        </div>
                        {!group.isSynthetic ? (
                          <input type="hidden" name="groupId" value={group.id} />
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {group.isSynthetic ? (
                          <span className="text-[#93a4c7]">{formatPercent(group.targetWeight)}</span>
                        ) : (
                          <div className="flex justify-end">
                            <Input
                              name="targetWeight"
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              defaultValue={String(group.targetWeight)}
                              className={`${fieldClassName} w-28 py-2 text-right`}
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">{formatWon(String(group.investedAmount))}</td>
                      <td className="px-3 py-3 text-right">{formatWon(String(group.marketValue))}</td>
                      <td className="px-3 py-3 text-right">{formatPercent(group.currentWeight)}</td>
                      <td className="px-3 py-3 text-right text-[#ff8e8e]">
                        {group.buyAmount > 0 ? formatWon(String(group.buyAmount)) : "-"}
                      </td>
                      <td className="px-3 py-3 text-right text-[#8fb6ff]">
                        {group.sellAmount > 0 ? formatWon(String(group.sellAmount)) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-white/10 bg-black/20 font-semibold text-white">
                  <tr>
                    <td className="px-3 py-3">합계</td>
                    <td className="px-3 py-3 text-right">
                      {formatPercent(
                        data.assetGroups
                          .filter((group) => !group.isSynthetic)
                          .reduce((sum, group) => sum + group.targetWeight, 0),
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {formatWon(
                        String(
                          data.assetGroups.reduce(
                            (sum, group) => sum + group.investedAmount,
                            0,
                          ),
                        ),
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {formatWon(
                        String(
                          data.assetGroups.reduce(
                            (sum, group) => sum + group.marketValue,
                            0,
                          ),
                        ),
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {formatPercent(
                        data.assetGroups.reduce(
                          (sum, group) => sum + group.currentWeight,
                          0,
                        ),
                      )}
                    </td>
                    <td className="px-3 py-3 text-right text-[#ff8e8e]">
                      {formatWon(
                        String(
                          data.assetGroups.reduce((sum, group) => sum + group.buyAmount, 0),
                        ),
                      )}
                    </td>
                    <td className="px-3 py-3 text-right text-[#8fb6ff]">
                      {formatWon(
                        String(
                          data.assetGroups.reduce((sum, group) => sum + group.sellAmount, 0),
                        ),
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="border-t border-white/8 bg-black/10 p-3">
              <SubmitButton className="w-full" pendingLabel="목표 비중 저장 중...">
                목표 비중 저장
              </SubmitButton>
            </div>
          </form>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <form action={createPortfolioAssetGroupAction} className="rounded-[1.25rem] border border-dashed border-white/10 bg-black/10 p-4">
              <input type="hidden" name="portfolioId" value={data.portfolio.id} />
              <input type="hidden" name="sortOrder" value={data.assetGroups.length} />
              <h4 className="text-lg font-semibold">자산군 추가</h4>
              <label className="mt-4 block space-y-1.5">
                <span className="text-sm font-medium">자산군 이름</span>
                <Input name="name" required className={`${fieldClassName} py-2.5`} />
              </label>
              <label className="mt-4 block space-y-1.5">
                <span className="text-sm font-medium">초기 비중</span>
                <Input
                  name="targetWeight"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  defaultValue={
                    data.assetGroups.filter((group) => !group.isSynthetic).length === 0
                      ? "100"
                      : "0"
                  }
                  className={`${fieldClassName} py-2.5`}
                />
              </label>
              <SubmitButton className="mt-4 w-full" pendingLabel="자산군 저장 중...">
                자산군 추가
              </SubmitButton>
            </form>

            <div className="space-y-3">
              {data.assetGroups
                .filter((group) => !group.isSynthetic)
                .map((group) => (
                  <SettingsDialog
                    key={group.id}
                    trigger={
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-[1.1rem] border border-[var(--border)] bg-white/4 px-4 py-3 text-left transition hover:bg-white/8"
                      >
                        <span className="font-medium text-white">{group.name}</span>
                        <span className="text-sm text-[#93a4c7]">상세 수정</span>
                      </button>
                    }
                  >
                    <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
                      <h4 className="text-xl font-semibold">자산군 수정</h4>
                      <form action={updatePortfolioAssetGroupAction} className="mt-5 space-y-4">
                        <input type="hidden" name="id" value={group.id} />
                        <input type="hidden" name="portfolioId" value={data.portfolio.id} />
                        <input type="hidden" name="sortOrder" value={0} />
                        <label className="space-y-1.5">
                          <span className="text-sm font-medium">이름</span>
                          <Input
                            name="name"
                            defaultValue={group.name}
                            required
                            className={`${fieldClassName} py-2.5`}
                          />
                        </label>
                        <label className="space-y-1.5">
                          <span className="text-sm font-medium">현재 저장 비중</span>
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
                        <SubmitButton className="w-full" pendingLabel="자산군 저장 중...">
                          자산군 저장
                        </SubmitButton>
                      </form>
                      <form action={deletePortfolioAssetGroupAction} className="mt-3">
                        <input type="hidden" name="id" value={group.id} />
                        <input type="hidden" name="portfolioId" value={data.portfolio.id} />
                        <ConfirmSubmitButton
                          confirmMessage="이 자산군을 삭제하시겠습니까? 연결 항목은 미분류로 이동합니다."
                          className="w-full rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                        >
                          삭제
                        </ConfirmSubmitButton>
                      </form>
                    </Card>
                  </SettingsDialog>
                ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
              Holdings
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              포트폴리오 편입 항목
            </h3>
          </div>
          <Badge tone="info" compact>
            {data.managedItems.length}개
          </Badge>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-black/20 text-[#9cb0d8]">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">종목명</th>
                  <th className="px-3 py-3 text-left font-semibold">연결 상태</th>
                  <th className="px-3 py-3 text-right font-semibold">보유수량</th>
                  <th className="px-3 py-3 text-right font-semibold">평가금</th>
                  <th className="px-3 py-3 text-right font-semibold">수익률</th>
                  <th className="px-3 py-3 text-left font-semibold">자산군 연결</th>
                  <th className="px-3 py-3 text-right font-semibold">작업</th>
                </tr>
              </thead>
              <tbody>
                {data.managedItems.map((item) => (
                  <tr key={item.id} className="border-t border-white/8">
                    <td className="px-3 py-3">
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-xs text-[#93a4c7]">{item.code}</div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={item.isLinked ? "done" : "info"} compact>
                        {item.isLinked ? item.groupName : "미편입"}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-right">{item.quantity || "-"}</td>
                    <td className="px-3 py-3 text-right">
                      {item.marketValue > 0 ? formatWon(String(item.marketValue)) : "-"}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {item.marketValue > 0 ? <ProfitTone value={item.profitRate} /> : "-"}
                    </td>
                    <td className="px-3 py-3">
                      <form action={updatePortfolioHoldingAction} className="flex gap-2">
                        <input type="hidden" name="portfolioId" value={data.portfolio.id} />
                        <input type="hidden" name="investmentItemId" value={item.id} />
                        <Select
                          name="portfolioAssetGroupId"
                          defaultValue={item.portfolioAssetGroupId || ""}
                          className={`${fieldClassName} min-w-[12rem] py-2.5`}
                        >
                          <option value="" className="bg-[#141d35] text-white">
                            미분류
                          </option>
                          {data.assetGroups
                            .filter((group) => !group.isSynthetic)
                            .map((group) => (
                              <option
                                key={group.id}
                                value={group.id}
                                className="bg-[#141d35] text-white"
                              >
                                {group.name}
                              </option>
                            ))}
                        </Select>
                        <SubmitButton
                          className="min-w-[6rem]"
                          pendingLabel="연결 중..."
                        >
                          저장
                        </SubmitButton>
                      </form>
                    </td>
                    <td className="px-3 py-3 text-right">
                      {item.isLinked ? (
                        <form action={updatePortfolioHoldingAction}>
                          <input type="hidden" name="mode" value="unlink" />
                          <input type="hidden" name="portfolioId" value={data.portfolio.id} />
                          <input type="hidden" name="investmentItemId" value={item.id} />
                          <ConfirmSubmitButton
                            confirmMessage="이 항목의 포트폴리오 연결을 해제하시겠습니까?"
                            className="rounded-full border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                          >
                            해제
                          </ConfirmSubmitButton>
                        </form>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
          Holdings Detail
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">자산군 상세 패널</h3>

        <div className="mt-5 space-y-3">
          {data.assetGroups.map((group) => (
            <details
              key={group.id}
              className="overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-white/3"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="font-semibold text-white">{group.name}</p>
                  <p className="mt-1 text-xs text-[#93a4c7]">
                    세팅 {formatPercent(group.targetWeight)} / 현재 {formatPercent(group.currentWeight)}
                  </p>
                </div>
                <div className="text-right text-sm text-[#93a4c7]">
                  <p>{formatWon(String(group.marketValue))}</p>
                  <p className="mt-1">
                    <ProfitTone value={group.profitRate} />
                  </p>
                </div>
              </summary>
              {group.items.length === 0 ? (
                <div className="border-t border-white/8 px-4 py-6 text-sm text-[#93a4c7]">
                  연결된 보유 항목이 없습니다.
                </div>
              ) : (
                <div className="overflow-x-auto border-t border-white/8">
                  <table className="min-w-full text-sm">
                    <thead className="bg-black/20 text-[#9cb0d8]">
                      <tr>
                        <th className="px-3 py-3 text-left font-semibold">종목명</th>
                        <th className="px-3 py-3 text-right font-semibold">매수단가</th>
                        <th className="px-3 py-3 text-right font-semibold">수량</th>
                        <th className="px-3 py-3 text-right font-semibold">투자금</th>
                        <th className="px-3 py-3 text-right font-semibold">현재가</th>
                        <th className="px-3 py-3 text-right font-semibold">평가금</th>
                        <th className="px-3 py-3 text-right font-semibold">수익률</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((item) => (
                        <tr key={item.investmentItemId} className="border-t border-white/8">
                          <td className="px-3 py-3">
                            <div className="font-medium text-white">{item.name}</div>
                            <div className="text-xs text-[#93a4c7]">{item.code}</div>
                            {item.accounts.length > 0 ? (
                              <div className="mt-2 text-xs text-[#93a4c7]">
                                계좌:{" "}
                                {item.accounts
                                  .map((account) =>
                                    account.displayId
                                      ? `${account.name} (${account.displayId})`
                                      : account.name,
                                  )
                                  .join(", ")}
                              </div>
                            ) : null}
                          </td>
                          <td className="px-3 py-3 text-right">
                            {formatMoney(String(item.averagePrice), item.currency)}
                          </td>
                          <td className="px-3 py-3 text-right">{item.quantity}</td>
                          <td className="px-3 py-3 text-right">{formatWon(String(item.investedAmount))}</td>
                          <td className="px-3 py-3 text-right">
                            {formatMoney(String(item.currentPrice), item.currency)}
                          </td>
                          <td className="px-3 py-3 text-right">{formatWon(String(item.marketValue))}</td>
                          <td className="px-3 py-3 text-right">
                            <ProfitTone value={item.profitRate} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </details>
          ))}
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
    <div className="rounded-[1.2rem] border border-[var(--border)] bg-white/4 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
        {label}
      </p>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-white">{value}</div>
    </div>
  );
}

function MetricItem({
  label,
  value,
}: Readonly<{
  label: string;
  value: React.ReactNode;
}>) {
  return (
    <div className="rounded-[1rem] border border-white/8 bg-black/10 px-3 py-3">
      <p className="text-xs uppercase tracking-[0.16em] text-[#93a4c7]">{label}</p>
      <div className="mt-2 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
