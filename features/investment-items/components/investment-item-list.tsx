import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { deleteInvestmentItemAction } from "@/features/investment-items/actions/delete-investment-item";
import { updateInvestmentItemAction } from "@/features/investment-items/actions/update-investment-item";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { formatDisplayDate } from "@/lib/utils";

type InvestmentItemListEntry = {
  id: string;
  name: string;
  code: string;
  category: string | null;
  industry: string | null;
  notes: string | null;
  active: boolean;
  logCount: number;
  updatedAt: Date;
};

export function InvestmentItemList({
  items,
}: Readonly<{
  items: InvestmentItemListEntry[];
}>) {
  const fieldClassName =
    "appearance-none border-white/12 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";

  return (
    <Card className="bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
            Items
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            투자 항목 목록
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3 overflow-y-auto pr-1 xl:max-h-[42rem]">
        {items.length === 0 ? (
          <EmptyState
            title="등록된 투자 항목이 없습니다"
            description="아래에서 첫 항목을 추가하면 투자일지와 대시보드에서 함께 사용합니다."
          />
        ) : (
          items.map((item) => (
            <article
              key={item.id}
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
                            {item.name}
                          </button>
                        }
                      >
                        <Card className="rounded-[22px] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] p-5 text-white shadow-[0_14px_40px_rgba(0,0,0,.28)] sm:p-6">
                          <div className="pr-14">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
                              Investment Item
                            </p>
                            <h3 className="mt-3 text-2xl font-semibold">
                              {item.name}
                            </h3>
                          </div>

                          <form action={updateInvestmentItemAction} className="mt-6 space-y-4">
                            <input type="hidden" name="id" value={item.id} />

                            <div className="grid gap-4 md:grid-cols-2">
                              <label className="space-y-1.5">
                                <span className="text-sm font-medium">항목명</span>
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
                                  required
                                  className={`${fieldClassName} py-2.5`}
                                />
                              </label>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <label className="space-y-1.5">
                                <span className="text-sm font-medium">카테고리</span>
                                <Input
                                  name="category"
                                  defaultValue={item.category ?? ""}
                                  className={`${fieldClassName} py-2`}
                                />
                              </label>
                              <label className="space-y-1.5">
                                <span className="text-sm font-medium">산업</span>
                                <Input
                                  name="industry"
                                  defaultValue={item.industry ?? ""}
                                  className={`${fieldClassName} py-2`}
                                />
                              </label>
                            </div>

                            <label className="space-y-1.5">
                              <span className="text-sm font-medium">메모</span>
                              <Textarea
                                name="notes"
                                defaultValue={item.notes ?? ""}
                                className={`${fieldClassName} min-h-24 py-2.5`}
                              />
                            </label>

                            <label className="inline-flex items-center gap-3 rounded-[1rem] border border-white/8 bg-black/10 px-4 py-3 text-sm text-white/88">
                              <input
                                type="checkbox"
                                name="active"
                                defaultChecked={item.active}
                                className="h-4 w-4 accent-[#6ea8fe]"
                              />
                              활성 항목
                            </label>

                            <SubmitButton className="w-full" pendingLabel="수정 저장 중...">
                              수정 저장
                            </SubmitButton>
                          </form>

                          <form action={deleteInvestmentItemAction} className="mt-3">
                            <input type="hidden" name="id" value={item.id} />
                            <ConfirmSubmitButton
                              confirmMessage="이 투자 항목을 삭제하시겠습니까? 연결된 투자일지가 있으면 삭제되지 않습니다."
                              className="w-full rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                            >
                              삭제
                            </ConfirmSubmitButton>
                          </form>
                        </Card>
                      </SettingsDialog>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-[#93a4c7]">
                        <span>{item.code}</span>
                        {item.category ? <span>{item.category}</span> : null}
                        {item.industry ? <span>{item.industry}</span> : null}
                        <span>{formatDisplayDate(item.updatedAt)}</span>
                      </div>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      <Badge tone={item.active ? "done" : "overdue"} compact>
                        {item.active ? "active" : "inactive"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 text-sm text-[#d7e2fb] md:grid-cols-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[#93a4c7]">
                        코드
                      </p>
                      <p className="mt-1 font-semibold">{item.code}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[#93a4c7]">
                        연결 로그
                      </p>
                      <p className="mt-1 font-semibold">{item.logCount}건</p>
                    </div>
                  </div>

                  {item.notes ? (
                    <p className="mt-3 text-sm leading-6 text-[#8fb0ec]">{item.notes}</p>
                  ) : null}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
