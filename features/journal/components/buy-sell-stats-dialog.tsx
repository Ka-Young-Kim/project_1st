"use client";

import { useMemo, useState } from "react";

import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { formatWon } from "@/lib/utils";

type MonthSeriesItem = {
  key: string;
  label: string;
  buy: number;
  sell: number;
};

type YearSeriesItem = {
  year: number;
  months: MonthSeriesItem[];
};

type BuySellStatsDialogProps = {
  buyCount: number;
  sellCount: number;
  monthlyBuyAmount: number;
  monthlySellAmount: number;
  initialYear: number;
  seriesByYear: YearSeriesItem[];
};

export function BuySellStatsDialog({
  buyCount,
  sellCount,
  monthlyBuyAmount,
  monthlySellAmount,
  initialYear,
  seriesByYear,
}: Readonly<BuySellStatsDialogProps>) {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    label: string;
    kind: "매수" | "매도";
    value: number;
  } | null>(null);
  const activeSeries = useMemo(
    () =>
      seriesByYear.find((item) => item.year === selectedYear) ?? seriesByYear[0],
    [selectedYear, seriesByYear],
  );
  const monthSeries = useMemo(
    () => activeSeries?.months ?? [],
    [activeSeries],
  );
  const maxTradeAmount = Math.max(
    1,
    ...monthSeries.flatMap((item) => [item.buy, item.sell]),
  );
  const chartWidth = 640;
  const chartHeight = 240;
  const chartPaddingX = 24;
  const chartPaddingY = 20;
  const plotWidth = chartWidth - chartPaddingX * 2;
  const plotHeight = chartHeight - chartPaddingY * 2;

  const { buyPolyline, sellPolyline } = useMemo(() => {
    const buyPoints = monthSeries
      .map((item, index) => {
        const x =
          chartPaddingX + (index / (monthSeries.length - 1 || 1)) * plotWidth;
        const y =
          chartHeight -
          chartPaddingY -
          (item.buy / maxTradeAmount) * plotHeight;
        return `${x},${y}`;
      })
      .join(" ");
    const sellPoints = monthSeries
      .map((item, index) => {
        const x =
          chartPaddingX + (index / (monthSeries.length - 1 || 1)) * plotWidth;
        const y =
          chartHeight -
          chartPaddingY -
          (item.sell / maxTradeAmount) * plotHeight;
        return `${x},${y}`;
      })
      .join(" ");

    return { buyPolyline: buyPoints, sellPolyline: sellPoints };
  }, [maxTradeAmount, monthSeries, plotHeight, plotWidth]);
  const tooltipPlacement =
    hoveredPoint && hoveredPoint.y < 52
      ? {
          top: `${(hoveredPoint.y / chartHeight) * 100}%`,
          transform: "translate(-50%, 14px)",
        }
      : hoveredPoint
        ? {
            top: `${(hoveredPoint.y / chartHeight) * 100}%`,
            transform: "translate(-50%, calc(-100% - 14px))",
          }
        : null;

  return (
    <SettingsDialog
      trigger={
        <button
          type="button"
          className="glass-panel flex min-h-[7.75rem] w-full flex-col rounded-[16px] p-3.5 text-left transition hover:bg-white/6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            매수 / 매도
          </p>
          <p className="mt-2 flex-1 text-[1.45rem] font-semibold tracking-tight">
            {buyCount} / {sellCount}
          </p>
          <p className="text-[13px] text-[var(--muted)]">
            {formatWon(String(monthlyBuyAmount))} /{" "}
            {formatWon(String(monthlySellAmount))}
          </p>
        </button>
      }
    >
      <section className="glass-panel rounded-[22px] p-5 text-white shadow-[0_14px_40px_rgba(0,0,0,.28)] sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="pr-14">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
              Monthly Stats
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              매수 / 매도 추이
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#93a4c7]">
              선택한 연도 기준 매수와 매도 거래금액을 월별 꺾은선으로 비교합니다.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-3 rounded-[1rem] border border-white/10 bg-white/4 px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#93a4c7]">
              Year
            </span>
            <select
              aria-label="통계 연도 선택"
              value={activeSeries?.year ?? selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className="appearance-none bg-transparent pr-2 text-sm font-semibold text-white outline-none"
            >
              {seriesByYear.map((item) => (
                <option
                  key={item.year}
                  value={item.year}
                  className="bg-[#141d35] text-white"
                >
                  {item.year}년
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 rounded-[20px] border border-white/8 bg-black/10 p-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.12em]">
            <span className="inline-flex items-center gap-2 text-emerald-200">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              매수
            </span>
            <span className="inline-flex items-center gap-2 text-sky-200">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-300" />
              매도
            </span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <div className="relative min-w-[640px]">
              {hoveredPoint ? (
                <div
                  className="pointer-events-none absolute z-10 min-w-[116px] rounded-[14px] border border-white/10 bg-[rgba(11,16,32,0.94)] px-3 py-2 text-xs shadow-[0_10px_24px_rgba(0,0,0,.28)]"
                  style={{
                    left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                    top: tooltipPlacement?.top,
                    transform: tooltipPlacement?.transform,
                  }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#93a4c7]">
                    {hoveredPoint.label} {hoveredPoint.kind}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {formatWon(String(hoveredPoint.value))}
                  </p>
                </div>
              ) : null}

              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="min-w-[640px]"
                role="img"
                aria-label={`${activeSeries?.year ?? selectedYear}년 매수 매도 추이 차트`}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = chartHeight - chartPaddingY - ratio * plotHeight;
                  return (
                    <line
                      key={ratio}
                      x1={chartPaddingX}
                      y1={y}
                      x2={chartWidth - chartPaddingX}
                      y2={y}
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="1"
                    />
                  );
                })}
                <polyline
                  fill="none"
                  stroke="#86efac"
                  strokeWidth="3"
                  points={buyPolyline}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <polyline
                  fill="none"
                  stroke="#7dd3fc"
                  strokeWidth="3"
                  points={sellPolyline}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {monthSeries.map((item, index) => {
                  const x =
                    chartPaddingX + (index / (monthSeries.length - 1 || 1)) * plotWidth;
                  const buyY =
                    chartHeight -
                    chartPaddingY -
                    (item.buy / maxTradeAmount) * plotHeight;
                  const sellY =
                    chartHeight -
                    chartPaddingY -
                    (item.sell / maxTradeAmount) * plotHeight;

                  return (
                    <g key={item.key}>
                      <circle
                        cx={x}
                        cy={buyY}
                        r="5"
                        fill="#86efac"
                        className="cursor-pointer"
                        onMouseEnter={() =>
                          setHoveredPoint({
                            x,
                            y: buyY,
                            label: item.label,
                            kind: "매수",
                            value: item.buy,
                          })
                        }
                        onFocus={() =>
                          setHoveredPoint({
                            x,
                            y: buyY,
                            label: item.label,
                            kind: "매수",
                            value: item.buy,
                          })
                        }
                      />
                      <circle
                        cx={x}
                        cy={sellY}
                        r="5"
                        fill="#7dd3fc"
                        className="cursor-pointer"
                        onMouseEnter={() =>
                          setHoveredPoint({
                            x,
                            y: sellY,
                            label: item.label,
                            kind: "매도",
                            value: item.sell,
                          })
                        }
                        onFocus={() =>
                          setHoveredPoint({
                            x,
                            y: sellY,
                            label: item.label,
                            kind: "매도",
                            value: item.sell,
                          })
                        }
                      />
                      <text
                        x={x}
                        y={chartHeight - 4}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#93a4c7"
                      >
                        {index + 1}월
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-lg font-semibold tracking-tight">달별 상세</h4>
            <p className="text-xs text-[#93a4c7]">
              {activeSeries?.year ?? selectedYear}년 월별 금액
            </p>
          </div>
          <div className="mt-4 overflow-hidden rounded-[18px] border border-white/8">
            <div className="grid grid-cols-[90px_1fr_1fr] bg-white/6 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#93a4c7]">
              <span>월</span>
              <span>매수</span>
              <span>매도</span>
            </div>
            <div className="max-h-[16.5rem] divide-y divide-white/8 overflow-y-auto">
              {monthSeries.map((item) => (
                <div
                  key={`${item.key}-detail`}
                  className="grid grid-cols-[90px_1fr_1fr] px-4 py-3 text-sm text-white/88"
                >
                  <span>{item.label}</span>
                  <span>{formatWon(String(item.buy))}</span>
                  <span>{formatWon(String(item.sell))}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SettingsDialog>
  );
}
