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
  return formatMoney(value, "KRW");
}

export function formatWon(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0원";
  }

  const sign = amount < 0 ? "-" : "";
  const absolute = Math.abs(amount);
  const formatted = formatNumericAmount(absolute);

  return `${sign}${formatted}원`;
}

export function formatMoney(value: string, currency = "KRW") {
  const amount = Number(value);
  const normalizedCurrency = currency.trim().toUpperCase() || "KRW";

  if (!Number.isFinite(amount)) {
    return normalizedCurrency === "KRW"
      ? "0원"
      : formatPrefixedCurrency(0, normalizedCurrency);
  }

  const sign = amount < 0 ? "-" : "";
  const absolute = Math.abs(amount);

  if (normalizedCurrency === "KRW") {
    return `${sign}${formatNumericAmount(absolute)}원`;
  }

  return `${sign}${formatPrefixedCurrency(absolute, normalizedCurrency)}`;
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

function formatNumericAmount(value: number) {
  const hasFraction = !Number.isInteger(value);
  const formatted = hasFraction
    ? value.toFixed(2).replace(/\.?0+$/, "")
    : value.toString();
  const [whole, fraction] = formatted.split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fraction ? `${withCommas}.${fraction}` : withCommas;
}

function formatPrefixedCurrency(value: number, currency: string) {
  const symbol = getCurrencyPrefix(currency);
  const formatted = formatNumericAmount(value);

  return symbol ? `${symbol} ${formatted}` : `${currency} ${formatted}`;
}

function getCurrencyPrefix(currency: string) {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "EUR";
    case "JPY":
      return "JPY";
    default:
      return "";
  }
}
