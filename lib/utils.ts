export function cx(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(" ");
}

export function formatDisplayDate(date: Date) {
  const parts = getSeoulDateParts(date);
  return `${parts.year}.${pad2(parts.month)}.${pad2(parts.day)}`;
}

export function formatDateInput(date: Date) {
  const adjusted = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return adjusted.toISOString().slice(0, 10);
}

export function getTodayDateInputInSeoul() {
  const today = getSeoulDateParts(new Date());
  return `${today.year}-${pad2(today.month)}-${pad2(today.day)}`;
}

export function formatCurrency(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "KRW 0";
  }

  const sign = amount < 0 ? "-" : "";
  const absolute = Math.abs(amount);
  const hasFraction = !Number.isInteger(absolute);
  const formatted = hasFraction
    ? absolute.toFixed(2).replace(/\.?0+$/, "")
    : absolute.toString();
  const [whole, fraction] = formatted.split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fraction
    ? `${sign}KRW ${withCommas}.${fraction}`
    : `${sign}KRW ${withCommas}`;
}

export function formatWon(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0 원";
  }

  const sign = amount < 0 ? "-" : "";
  const absolute = Math.abs(amount);
  const hasFraction = !Number.isInteger(absolute);
  const formatted = hasFraction
    ? absolute.toFixed(2).replace(/\.?0+$/, "")
    : absolute.toString();
  const [whole, fraction] = formatted.split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fraction
    ? `${sign}${withCommas}.${fraction} 원`
    : `${sign}${withCommas} 원`;
}

export function getTodayRangeInSeoul() {
  return getDayRangeInSeoul(new Date());
}

export function getDayRangeFromDateInputInSeoul(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error(`Invalid date input: ${value}`);
  }

  const start = new Date(Date.UTC(year, month - 1, day - 1, 15, 0, 0));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}

export function getCurrentMonthRangeInSeoul() {
  const now = getSeoulDateParts(new Date());
  const start = new Date(Date.UTC(now.year, now.month - 1, 0, 15, 0, 0));
  const end =
    now.month === 12
      ? new Date(Date.UTC(now.year, 11, 31, 15, 0, 0))
      : new Date(Date.UTC(now.year, now.month - 1, lastDayOfMonth(now.year, now.month), 15, 0, 0));
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

function getDayRangeInSeoul(date: Date) {
  const parts = getSeoulDateParts(date);
  const start = new Date(Date.UTC(parts.year, parts.month - 1, parts.day - 1, 15, 0, 0));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

function getSeoulDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  };
}

function pad2(value: number) {
  return value.toString().padStart(2, "0");
}

function lastDayOfMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}
