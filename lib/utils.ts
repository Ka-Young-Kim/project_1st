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

export function getTodayRangeInSeoul() {
  return getDayRangeInSeoul(new Date());
}

export function getCurrentMonthRangeInSeoul() {
  const now = getSeoulDateParts(new Date());
  const start = new Date(Date.UTC(now.year, now.month - 1, 1, 15, 0, 0));
  const end =
    now.month === 12
      ? new Date(Date.UTC(now.year + 1, 0, 1, 15, 0, 0))
      : new Date(Date.UTC(now.year, now.month, 1, 15, 0, 0));
  return { start, end };
}

function getDayRangeInSeoul(date: Date) {
  const parts = getSeoulDateParts(date);
  const start = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 15, 0, 0));
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
