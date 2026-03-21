export const ALLOCATION_CHART_COLORS = [
  "#79c2ff",
  "#8de38f",
  "#ffd166",
  "#ff8f70",
  "#5eead4",
  "#c4b5fd",
  "#f9a8d4",
] as const;

const MUTED_GRADIENT =
  "conic-gradient(from -90deg, rgba(148, 163, 184, 0.22) 0deg 360deg)";

type AllocationChartInput = {
  id: string;
  name: string;
  targetWeight: number;
  currentWeight: number;
  isSynthetic: boolean;
};

export type AllocationChartRow = AllocationChartInput & {
  color: string;
  gapWeight: number;
};

type DonutWeightKey = "targetWeight" | "currentWeight";

export type AllocationDonutSegment = {
  id: string;
  color: string;
  length: number;
  offset: number;
};

export type AllocationDonutLabel = {
  id: string;
  name: string;
  color: string;
  percentageText: string;
  textAnchor: "start" | "end";
  textX: number;
  textY: number;
  lineStartX: number;
  lineStartY: number;
  lineBendX: number;
  lineBendY: number;
  lineEndX: number;
  lineEndY: number;
};

const DONUT_CENTER_X = 210;
const DONUT_CENTER_Y = 170;
const DONUT_RADIUS = 94;
const DONUT_STROKE_WIDTH = 48;
const DONUT_LABEL_RADIUS = DONUT_RADIUS + DONUT_STROKE_WIDTH / 2;
const DONUT_LABEL_MIN_Y = 42;
const DONUT_LABEL_MAX_Y = 298;
const DONUT_LABEL_GAP = 28;
const DONUT_LEFT_TEXT_X = 58;
const DONUT_RIGHT_TEXT_X = 362;
const DONUT_LEFT_BEND_X = 86;
const DONUT_RIGHT_BEND_X = 334;
const DONUT_LEFT_LINE_END_X = 72;
const DONUT_RIGHT_LINE_END_X = 348;

function roundWeight(value: number) {
  return Math.round(value * 100) / 100;
}

function formatAngle(value: number) {
  return `${roundWeight(value)
    .toFixed(2)
    .replace(/\.?0+$/, "")}deg`;
}

function formatPercent(value: number) {
  return `${roundWeight(value).toFixed(1).replace(/\.0$/, "")}%`;
}

function polarPoint(radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: DONUT_CENTER_X + radius * Math.cos(radians),
    y: DONUT_CENTER_Y + radius * Math.sin(radians),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function distributeLabels(
  labels: Array<{
    index: number;
    desiredY: number;
  }>,
) {
  if (labels.length === 0) {
    return [];
  }

  const sorted = [...labels].sort(
    (left, right) => left.desiredY - right.desiredY,
  );
  const adjusted = sorted.map((label) => ({
    ...label,
    labelY: clamp(label.desiredY, DONUT_LABEL_MIN_Y, DONUT_LABEL_MAX_Y),
  }));

  for (let index = 1; index < adjusted.length; index += 1) {
    adjusted[index].labelY = Math.max(
      adjusted[index].labelY,
      adjusted[index - 1].labelY + DONUT_LABEL_GAP,
    );
  }

  const lastLabel = adjusted.at(-1);

  if (lastLabel && lastLabel.labelY > DONUT_LABEL_MAX_Y) {
    lastLabel.labelY = DONUT_LABEL_MAX_Y;

    for (let index = adjusted.length - 2; index >= 0; index -= 1) {
      adjusted[index].labelY = Math.min(
        adjusted[index].labelY,
        adjusted[index + 1].labelY - DONUT_LABEL_GAP,
      );
    }

    if (adjusted[0].labelY < DONUT_LABEL_MIN_Y) {
      adjusted[0].labelY = DONUT_LABEL_MIN_Y;

      for (let index = 1; index < adjusted.length; index += 1) {
        adjusted[index].labelY = Math.max(
          adjusted[index].labelY,
          adjusted[index - 1].labelY + DONUT_LABEL_GAP,
        );
      }
    }
  }

  return adjusted;
}

function buildGradient(
  rows: AllocationChartRow[],
  key: "targetWeight" | "currentWeight",
) {
  const visibleRows = rows.filter((row) => row[key] > 0);
  const totalWeight = visibleRows.reduce((sum, row) => sum + row[key], 0);

  if (totalWeight <= 0) {
    return MUTED_GRADIENT;
  }

  let cursor = 0;
  const stops = visibleRows.map((row) => {
    const start = cursor;
    cursor += (row[key] / totalWeight) * 360;

    return `${row.color} ${formatAngle(start)} ${formatAngle(cursor)}`;
  });

  return `conic-gradient(from -90deg, ${stops.join(", ")})`;
}

export function buildAllocationChartModel(groups: AllocationChartInput[]) {
  const rows = groups.map<AllocationChartRow>((group, index) => ({
    ...group,
    color: ALLOCATION_CHART_COLORS[index % ALLOCATION_CHART_COLORS.length],
    gapWeight: roundWeight(Math.abs(group.currentWeight - group.targetWeight)),
  }));

  const largestGap =
    rows.reduce<AllocationChartRow | null>((currentLargest, row) => {
      if (!currentLargest || row.gapWeight > currentLargest.gapWeight) {
        return row;
      }

      return currentLargest;
    }, null) ?? null;

  return {
    rows,
    targetGradient: buildGradient(rows, "targetWeight"),
    currentGradient: buildGradient(rows, "currentWeight"),
    largestGap,
  };
}

export function buildAllocationDonutChart(
  rows: AllocationChartRow[],
  key: DonutWeightKey,
) {
  const visibleRows = rows.filter((row) => row[key] > 0);
  const circumference = 2 * Math.PI * DONUT_RADIUS;
  const totalWeight = visibleRows.reduce((sum, row) => sum + row[key], 0);

  if (totalWeight <= 0) {
    return {
      centerX: DONUT_CENTER_X,
      centerY: DONUT_CENTER_Y,
      radius: DONUT_RADIUS,
      strokeWidth: DONUT_STROKE_WIDTH,
      circumference,
      segments: [
        {
          id: "__empty__",
          color: "rgba(148, 163, 184, 0.22)",
          length: circumference,
          offset: 0,
        },
      ] satisfies AllocationDonutSegment[],
      labels: [] satisfies AllocationDonutLabel[],
    };
  }

  let consumedWeight = 0;
  const labelCandidates = visibleRows.map((row, index) => {
    const startAngle = (consumedWeight / totalWeight) * 360;
    const sweepAngle = (row[key] / totalWeight) * 360;
    const midAngle = startAngle + sweepAngle / 2;
    const startPoint = polarPoint(DONUT_LABEL_RADIUS, midAngle);
    consumedWeight += row[key];

    return {
      index,
      id: row.id,
      name: row.name,
      color: row.color,
      percentageText: formatPercent(row[key]),
      lineStartX: roundWeight(startPoint.x),
      lineStartY: roundWeight(startPoint.y),
      desiredY: roundWeight(startPoint.y),
      isRightSide: startPoint.x >= DONUT_CENTER_X,
    };
  });

  const rightSideLabels = distributeLabels(
    labelCandidates
      .filter((label) => label.isRightSide)
      .map((label) => ({
        index: label.index,
        desiredY: label.desiredY,
      })),
  );
  const leftSideLabels = distributeLabels(
    labelCandidates
      .filter((label) => !label.isRightSide)
      .map((label) => ({
        index: label.index,
        desiredY: label.desiredY,
      })),
  );
  const labelYByIndex = new Map<number, number>([
    ...rightSideLabels.map((label) => [label.index, label.labelY] as const),
    ...leftSideLabels.map((label) => [label.index, label.labelY] as const),
  ]);

  return {
    centerX: DONUT_CENTER_X,
    centerY: DONUT_CENTER_Y,
    radius: DONUT_RADIUS,
    strokeWidth: DONUT_STROKE_WIDTH,
    circumference,
    segments: visibleRows.reduce<AllocationDonutSegment[]>((segments, row) => {
      const currentOffset = segments.reduce(
        (sum, segment) => sum + segment.length,
        0,
      );

      segments.push({
        id: row.id,
        color: row.color,
        length: circumference * (row[key] / totalWeight),
        offset: currentOffset,
      });

      return segments;
    }, []),
    labels: labelCandidates.map<AllocationDonutLabel>((label) => {
      const labelY = labelYByIndex.get(label.index) ?? label.desiredY;

      if (label.isRightSide) {
        return {
          id: label.id,
          name: label.name,
          color: label.color,
          percentageText: label.percentageText,
          textAnchor: "start",
          textX: DONUT_RIGHT_TEXT_X,
          textY: labelY,
          lineStartX: label.lineStartX,
          lineStartY: label.lineStartY,
          lineBendX: DONUT_RIGHT_BEND_X,
          lineBendY: labelY,
          lineEndX: DONUT_RIGHT_LINE_END_X,
          lineEndY: labelY,
        };
      }

      return {
        id: label.id,
        name: label.name,
        color: label.color,
        percentageText: label.percentageText,
        textAnchor: "end",
        textX: DONUT_LEFT_TEXT_X,
        textY: labelY,
        lineStartX: label.lineStartX,
        lineStartY: label.lineStartY,
        lineBendX: DONUT_LEFT_BEND_X,
        lineBendY: labelY,
        lineEndX: DONUT_LEFT_LINE_END_X,
        lineEndY: labelY,
      };
    }),
  };
}
