import {
  buildAllocationChartModel,
  buildAllocationDonutChart,
} from "@/features/portfolios/lib/allocation-chart";
import type { PortfolioManagementData } from "@/features/portfolios/services/portfolio-management-service";

type AssetGroupSummary = PortfolioManagementData["assetGroups"][number];

function AllocationDonutCard({
  title,
  chart,
  gradientId,
}: Readonly<{
  title: string;
  chart: ReturnType<typeof buildAllocationDonutChart>;
  gradientId: string;
}>) {
  return (
    <div className="rounded-[1.25rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-5 sm:p-6">
      <h4 className="text-base font-semibold text-white">{title}</h4>
      <div className="mt-5 flex min-h-[19rem] items-center justify-center overflow-hidden sm:min-h-[21rem]">
        <svg
          viewBox="0 0 420 340"
          className="w-full max-w-[31rem]"
          role="img"
          aria-label={`${title} 도넛 차트`}
        >
          {chart.segments.map((segment) => (
            <circle
              key={segment.id}
              cx={chart.centerX}
              cy={chart.centerY}
              r={chart.radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={chart.strokeWidth}
              strokeDasharray={`${segment.length} ${chart.circumference - segment.length}`}
              strokeDashoffset={-segment.offset}
              transform={`rotate(-90 ${chart.centerX} ${chart.centerY})`}
            />
          ))}

          <circle
            cx={chart.centerX}
            cy={chart.centerY}
            r={chart.radius - chart.strokeWidth / 2 + 6}
            fill={`url(#${gradientId})`}
            stroke="rgba(255,255,255,0.08)"
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(20,29,53,0.98)" />
              <stop offset="100%" stopColor="rgba(12,19,36,0.98)" />
            </linearGradient>
          </defs>

          {chart.labels.map((label) => (
            <g key={label.id}>
              <line
                x1={label.lineStartX}
                y1={label.lineStartY}
                x2={label.lineBendX}
                y2={label.lineBendY}
                stroke={label.color}
                strokeOpacity="0.82"
                strokeWidth="1.5"
              />
              <line
                x1={label.lineBendX}
                y1={label.lineBendY}
                x2={label.lineEndX}
                y2={label.lineEndY}
                stroke={label.color}
                strokeOpacity="0.82"
                strokeWidth="1.5"
              />
              <circle
                cx={label.lineStartX}
                cy={label.lineStartY}
                r="2.5"
                fill={label.color}
              />
              <text
                x={label.textX}
                y={label.textY - 2}
                textAnchor={label.textAnchor}
                fill="#f8fbff"
                fontSize="13"
                fontWeight="700"
              >
                {label.name}
              </text>
              <text
                x={label.textX}
                y={label.textY + 14}
                textAnchor={label.textAnchor}
                fill="#9fb2d8"
                fontSize="12"
                fontWeight="600"
              >
                {label.percentageText}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export function PortfolioAllocationOverview({
  assetGroups,
}: Readonly<{
  assetGroups: AssetGroupSummary[];
}>) {
  const model = buildAllocationChartModel(
    assetGroups.map((group) => ({
      id: group.id,
      name: group.name,
      targetWeight: group.targetWeight,
      currentWeight: group.currentWeight,
      isSynthetic: group.isSynthetic,
    })),
  );
  const targetChart = buildAllocationDonutChart(model.rows, "targetWeight");
  const currentChart = buildAllocationDonutChart(model.rows, "currentWeight");

  return (
    <section className="mt-6 rounded-[1.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-5 md:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
          Allocation Overview
        </p>
        <h3 className="mt-2 text-[1.65rem] font-semibold tracking-tight text-white">
          포트폴리오 구성
        </h3>
        <p className="mt-1 text-sm leading-6 text-[#93a4c7]">
          차트가 먼저 보이도록 목표 구성과 현재 구성을 자산군 기준으로 바로
          비교합니다.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <AllocationDonutCard
          title="목표 구성"
          chart={targetChart}
          gradientId="allocation-donut-target"
        />
        <AllocationDonutCard
          title="현재 구성"
          chart={currentChart}
          gradientId="allocation-donut-current"
        />
      </div>
    </section>
  );
}
