import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { deletePortfolioAction } from "@/features/portfolios/actions/delete-portfolio";
import { updatePortfolioAction } from "@/features/portfolios/actions/update-portfolio";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";

type PortfolioListItem = {
  id: string;
  name: string;
  description: string | null;
};

export function PortfolioList({
  portfolios,
  selectedPortfolioId,
}: Readonly<{
  portfolios: PortfolioListItem[];
  selectedPortfolioId?: string;
}>) {
  return (
    <Card className="text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
        Portfolios
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        포트폴리오 목록
      </h2>

      <div className="mt-5 space-y-3">
        {portfolios.length === 0 ? (
          <EmptyState
            title="등록된 포트폴리오가 없습니다"
            description="아래에서 첫 포트폴리오를 생성하세요."
          />
        ) : (
          portfolios.map((portfolio) => (
            <article
              key={portfolio.id}
              className="rounded-[1.25rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(22,32,58,.96),rgba(20,29,53,.96))] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,.18)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <SettingsDialog
                      trigger={
                        <button
                          type="button"
                          className="min-w-0 flex-1 text-left text-[1.05rem] font-semibold leading-snug tracking-tight text-white transition hover:text-[#8fb0ec]"
                        >
                          {portfolio.name}
                        </button>
                      }
                    >
                      <Card surface="dialog" className="p-5 sm:p-6">
                        <div className="pr-14">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
                            Portfolio
                          </p>
                          <h3 className="mt-3 text-2xl font-semibold">{portfolio.name}</h3>
                        </div>
                        <form action={updatePortfolioAction} className="mt-6 space-y-4">
                          <input type="hidden" name="id" value={portfolio.id} />
                          <label className="space-y-1.5">
                            <span className="text-sm font-medium">이름</span>
                            <Input
                              name="name"
                              defaultValue={portfolio.name}
                              required
                              tone="dark"
                              className="py-2.5"
                            />
                          </label>
                          <label className="space-y-1.5">
                            <span className="text-sm font-medium">설명</span>
                            <Textarea
                              name="description"
                              defaultValue={portfolio.description ?? ""}
                              tone="dark"
                              className="min-h-24 py-2.5"
                            />
                          </label>
                          <SubmitButton className="w-full" pendingLabel="수정 저장 중...">
                            수정 저장
                          </SubmitButton>
                        </form>
                        <form action={deletePortfolioAction} className="mt-3">
                          <input type="hidden" name="id" value={portfolio.id} />
                          <ConfirmSubmitButton
                            confirmMessage="이 포트폴리오를 삭제하시겠습니까? 항목이나 일지가 연결된 포트폴리오는 삭제할 수 없습니다."
                            className="w-full rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                          >
                            삭제
                          </ConfirmSubmitButton>
                        </form>
                      </Card>
                    </SettingsDialog>
                    <div className="flex items-center gap-2">
                      {selectedPortfolioId === portfolio.id ? (
                        <Badge tone="info" compact>
                          selected
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/portfolios?${new URLSearchParams({ portfolio: portfolio.id }).toString()}`}
                      className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/6 px-3 py-1.5 text-xs font-semibold text-[#dce7ff] transition hover:bg-white/10"
                    >
                      이 포트폴리오 구성하기
                    </Link>
                  </div>
                </div>
              </div>
              {portfolio.description ? (
                <p className="mt-3 text-sm leading-6 text-[#8fb0ec]">{portfolio.description}</p>
              ) : null}
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
