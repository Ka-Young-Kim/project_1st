import { Card } from "@/components/ui/card";

type RiskControlProps = {
  dueTodayCount: number;
  monthlyTradeCount: number;
  incompleteTodoCount: number;
};

type RiskTone = "high" | "mid" | "low";

type RiskItem = {
  label: string;
  level: string;
  description: string;
  tone: RiskTone;
  tag: string;
};

const risks = (props: RiskControlProps): RiskItem[] => [
  {
    label: "마감 압박",
    level: props.dueTodayCount >= 3 ? "높음" : props.dueTodayCount > 0 ? "중간" : "낮음",
    description:
      props.dueTodayCount >= 3
        ? "오늘 안에 처리할 TODO가 많습니다. 작업 순서를 먼저 고정하는 편이 안전합니다."
        : props.dueTodayCount > 0
          ? "당일 마감 항목이 있어 우선순위 점검이 필요합니다."
          : "오늘 마감 항목이 없어 비교적 안정적인 상태입니다.",
    tone:
      props.dueTodayCount >= 3
        ? "high"
        : props.dueTodayCount > 0
          ? "mid"
          : "low",
    tag:
      props.dueTodayCount >= 3
        ? "즉시 정리 필요"
        : props.dueTodayCount > 0
          ? "모니터링 필요"
          : "안정 구간",
  },
  {
    label: "기록 편중",
    level: props.monthlyTradeCount >= 5 ? "중간" : "낮음",
    description:
      props.monthlyTradeCount >= 5
        ? "거래 로그가 빠르게 늘고 있습니다. 매매 이유와 회고의 질을 같이 확인하세요."
        : "거래 빈도는 안정적인 편입니다.",
    tone: props.monthlyTradeCount >= 5 ? "mid" : "low",
    tag: props.monthlyTradeCount >= 5 ? "회고 밀도 확인" : "안정 구간",
  },
  {
    label: "백로그 누적",
    level: props.incompleteTodoCount >= 6 ? "중간" : "낮음",
    description:
      props.incompleteTodoCount >= 6
        ? "열린 TODO가 누적되고 있습니다. 삭제하거나 묶을 항목을 분리하세요."
        : "미완료 항목 규모는 아직 관리 가능한 수준입니다.",
    tone: props.incompleteTodoCount >= 6 ? "mid" : "low",
    tag: props.incompleteTodoCount >= 6 ? "정리 대상 존재" : "관리 가능",
  },
];

const toneStyles: Record<RiskTone, string> = {
  high: "bg-[rgba(255,125,125,0.12)] text-[#ffc1c1] border-[rgba(255,125,125,0.24)]",
  mid: "bg-[rgba(255,203,107,0.12)] text-[#ffe4ac] border-[rgba(255,203,107,0.24)]",
  low: "bg-[rgba(73,209,125,0.12)] text-[#c9ffe0] border-[rgba(73,209,125,0.24)]",
};

export function RiskControl(props: Readonly<RiskControlProps>) {
  return (
    <Card className="rounded-[22px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">리스크 점검</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            현재 운영 흐름에서 취약한 구간을 빠르게 확인합니다.
          </p>
        </div>
        <span className="inline-flex h-8 items-center rounded-full border border-[rgba(110,168,254,0.22)] bg-[rgba(110,168,254,0.12)] px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#cfe1ff]">
          Risk Control
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {risks(props).map((risk) => (
          <article
            key={risk.label}
            className="rounded-[16px] border border-[var(--border)] bg-white/3 p-4"
          >
            <div className="flex items-center justify-between gap-3 text-sm font-semibold">
              <span>{risk.label}</span>
              <span className="text-[var(--muted)]">{risk.level}</span>
            </div>
            <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
              {risk.description}
            </p>
            <span
              className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneStyles[risk.tone]}`}
            >
              {risk.tag}
            </span>
          </article>
        ))}
      </div>
    </Card>
  );
}
