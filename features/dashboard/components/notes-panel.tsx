import { Card } from "@/components/ui/card";

export function NotesPanel() {
  return (
    <Card className="rounded-[22px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">이번 주 운영 메모</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            짧은 원칙과 점검 포인트를 두는 영역입니다.
          </p>
        </div>
        <span className="inline-flex h-8 items-center rounded-full border border-[rgba(110,168,254,0.22)] bg-[rgba(110,168,254,0.12)] px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#cfe1ff]">
          Notes
        </span>
      </div>

      <div className="mt-5 rounded-[16px] border border-[var(--border)] bg-white/3 p-4">
        <p className="text-sm leading-7 text-[#d8e4ff]">
          추격 진입보다 비중 균형을 먼저 확인하고, 거래 전에는 이유 한 줄이라도
          남기는 것을 원칙으로 둡니다. 성과보다 규칙 준수율을 우선으로 봅니다.
        </p>
      </div>

      <p className="mt-4 text-xs leading-6 text-[var(--muted)]">
        상단 KPI로 상태를 보고, 중앙에서 실행하고, 우측에서 목표와 리스크를
        점검하는 구조입니다.
      </p>
    </Card>
  );
}
