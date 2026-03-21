import { describe, expect, it } from "vitest";

import {
  ALLOCATION_CHART_COLORS,
  buildAllocationDonutChart,
  buildAllocationChartModel,
} from "@/features/portfolios/lib/allocation-chart";

describe("allocation chart helpers", () => {
  it("builds legend rows with stable colors and largest gap metadata", () => {
    const model = buildAllocationChartModel([
      {
        id: "stocks",
        name: "주식",
        targetWeight: 50,
        currentWeight: 62,
        isSynthetic: false,
      },
      {
        id: "bonds",
        name: "채권",
        targetWeight: 30,
        currentWeight: 18,
        isSynthetic: false,
      },
      {
        id: "cash",
        name: "현금",
        targetWeight: 20,
        currentWeight: 20,
        isSynthetic: true,
      },
    ]);

    expect(model.rows.map((row) => row.color)).toEqual(
      ALLOCATION_CHART_COLORS.slice(0, 3),
    );
    expect(model.rows.map((row) => row.gapWeight)).toEqual([12, 12, 0]);
    expect(model.largestGap).toMatchObject({
      name: "주식",
      targetWeight: 50,
      currentWeight: 62,
      gapWeight: 12,
    });
  });

  it("creates conic gradients for target and current allocations", () => {
    const model = buildAllocationChartModel([
      {
        id: "stocks",
        name: "주식",
        targetWeight: 75,
        currentWeight: 40,
        isSynthetic: false,
      },
      {
        id: "bonds",
        name: "채권",
        targetWeight: 25,
        currentWeight: 60,
        isSynthetic: false,
      },
      {
        id: "cash",
        name: "현금",
        targetWeight: 0,
        currentWeight: 0,
        isSynthetic: true,
      },
    ]);

    expect(model.targetGradient).toBe(
      `conic-gradient(from -90deg, ${ALLOCATION_CHART_COLORS[0]} 0deg 270deg, ${ALLOCATION_CHART_COLORS[1]} 270deg 360deg)`,
    );
    expect(model.currentGradient).toBe(
      `conic-gradient(from -90deg, ${ALLOCATION_CHART_COLORS[0]} 0deg 144deg, ${ALLOCATION_CHART_COLORS[1]} 144deg 360deg)`,
    );
  });

  it("returns a muted fallback gradient when all weights are zero", () => {
    const model = buildAllocationChartModel([
      {
        id: "cash",
        name: "현금",
        targetWeight: 0,
        currentWeight: 0,
        isSynthetic: true,
      },
    ]);

    expect(model.targetGradient).toBe(
      "conic-gradient(from -90deg, rgba(148, 163, 184, 0.22) 0deg 360deg)",
    );
    expect(model.currentGradient).toBe(
      "conic-gradient(from -90deg, rgba(148, 163, 184, 0.22) 0deg 360deg)",
    );
    expect(model.largestGap).toMatchObject({
      name: "현금",
      gapWeight: 0,
    });
  });

  it("builds outside labels with leader lines for every visible slice", () => {
    const model = buildAllocationChartModel([
      {
        id: "stocks",
        name: "국내주식",
        targetWeight: 45,
        currentWeight: 67.9,
        isSynthetic: false,
      },
      {
        id: "global",
        name: "해외ETF",
        targetWeight: 25,
        currentWeight: 1.3,
        isSynthetic: false,
      },
      {
        id: "bonds",
        name: "채권",
        targetWeight: 20,
        currentWeight: 10.3,
        isSynthetic: false,
      },
      {
        id: "cash",
        name: "현금",
        targetWeight: 10,
        currentWeight: 20.2,
        isSynthetic: false,
      },
    ]);

    const donut = buildAllocationDonutChart(model.rows, "targetWeight");

    expect(donut.segments).toHaveLength(4);
    expect(donut.labels).toHaveLength(4);
    expect(donut.labels.map((label) => label.name)).toEqual([
      "국내주식",
      "해외ETF",
      "채권",
      "현금",
    ]);
    expect(donut.labels[0]).toMatchObject({
      name: "국내주식",
      textAnchor: "start",
      percentageText: "45%",
    });
    expect(donut.labels[1]).toMatchObject({
      name: "해외ETF",
      textAnchor: "end",
      percentageText: "25%",
    });
    expect(donut.labels[2]).toMatchObject({
      name: "채권",
      textAnchor: "end",
      percentageText: "20%",
    });
    expect(donut.labels[3]).toMatchObject({
      name: "현금",
      textAnchor: "end",
      percentageText: "10%",
    });
    expect(
      donut.labels.every((label) =>
        label.textAnchor === "start"
          ? label.lineEndX > label.lineStartX
          : label.lineEndX < label.lineStartX,
      ),
    ).toBe(true);
  });
});
