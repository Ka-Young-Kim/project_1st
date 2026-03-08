"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { TodoCalendarMonthPicker } from "@/features/todos/components/todo-calendar-month-picker";
import { cx, formatCurrency, getTodayDateInputInSeoul } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type JournalCalendarPreviewItem = {
  id: string;
  tradeDate: string;
  symbol: string;
  action: "buy" | "sell";
  quantity: string;
  price: string;
};

type JournalCalendarProps = {
  activeMonth?: string;
  entries: JournalCalendarPreviewItem[];
};

export function JournalCalendar({
  activeMonth,
  entries,
}: Readonly<JournalCalendarProps>) {
  const referenceDate = activeMonth
    ? new Date(`${activeMonth}-01T00:00:00`)
    : new Date();
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const monthValue = `${year}-${String(month + 1).padStart(2, "0")}`;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const leadingEmpty = firstDay.getDay();
  const entryMap = useMemo(() => {
    const items = new Map<string, JournalCalendarPreviewItem[]>();

    entries.forEach((entry) => {
      if (!entry.tradeDate.startsWith(monthValue)) {
        return;
      }

      const current = items.get(entry.tradeDate) ?? [];
      current.push(entry);
      items.set(entry.tradeDate, current);
    });

    return items;
  }, [entries, monthValue]);

  const today = getTodayDateInputInSeoul();
  const initialDate =
    today.startsWith(monthValue)
      ? today
      : Array.from(entryMap.keys()).sort()[0] ?? `${monthValue}-01`;
  const [previewDate, setPreviewDate] = useState(initialDate);
  const previewItems = entryMap.get(previewDate) ?? [];

  useEffect(() => {
    setPreviewDate(initialDate);
  }, [initialDate]);

  return (
    <section className="glass-panel rounded-[22px] p-5 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Calendar
          </p>
          <TodoCalendarMonthPicker value={monthValue} />
        </div>

        <Link
          href="/journal"
          className="inline-flex h-10 items-center rounded-full border border-[rgba(110,168,254,0.28)] bg-[rgba(110,168,254,0.12)] px-4 text-sm font-semibold text-[#cfe1ff] transition hover:bg-[rgba(110,168,254,0.18)]"
        >
          전체 보기
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2 text-center">
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
          >
            {day}
          </span>
        ))}

        {Array.from({ length: leadingEmpty }).map((_, index) => (
          <span key={`empty-${index}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isPreview = previewDate === date;
          const count = entryMap.get(date)?.length ?? 0;

          return (
            <button
              key={date}
              type="button"
              onMouseEnter={() => setPreviewDate(date)}
              onFocus={() => setPreviewDate(date)}
              className={cx(
                "relative flex h-11 items-center justify-center rounded-[0.95rem] border text-sm font-semibold transition",
                isPreview
                  ? "border-[rgba(110,168,254,0.35)] bg-[rgba(110,168,254,0.14)] text-[var(--foreground)]"
                  : "border-[var(--border)] bg-white/4 text-[var(--muted)] hover:bg-white/8 hover:text-[var(--foreground)]",
              )}
            >
              {day}
              {count > 0 ? (
                <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-[#6ea8fe]" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-[18px] border border-[var(--border)] bg-white/4 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {previewDate.replaceAll("-", ".")}
          </p>
          <span className="text-xs font-medium text-[var(--muted)]">
            {previewItems.length} logs
          </span>
        </div>

        <div className="mt-3 max-h-[10.5rem] space-y-2 overflow-y-auto pr-1">
          {previewItems.length === 0 ? (
            <p className="text-sm leading-6 text-[var(--muted)]">
              이 날짜에는 거래 기록이 없습니다.
            </p>
          ) : (
            previewItems.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 rounded-[14px] border border-[var(--border)] bg-black/10 px-3 py-2.5"
              >
                <span
                  className={cx(
                    "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold uppercase",
                    entry.action === "buy"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-sky-100 text-sky-800",
                  )}
                >
                  {entry.action === "buy" ? "B" : "S"}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--foreground)]">
                  {entry.symbol}
                </p>
                <span className="shrink-0 text-xs font-medium text-[#a9b8d6]">
                  {entry.quantity}주
                </span>
                <span className="shrink-0 text-xs font-medium text-[#93a4c7]">
                  {formatCurrency(entry.price)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
