"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { TodoCalendarMonthPicker } from "@/features/todos/components/todo-calendar-month-picker";
import { cx, getTodayDateInputInSeoul } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type CalendarTodoPreviewItem = {
  id: string;
  title: string;
  dueDate: string | null;
  completed: boolean;
};

type TodoCalendarProps = {
  activeMonth?: string;
  selectedDate?: string;
  todos: CalendarTodoPreviewItem[];
};

export function TodoCalendar({
  activeMonth,
  selectedDate,
  todos,
}: Readonly<TodoCalendarProps>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
  const todoMap = useMemo(() => {
    const entries = new Map<string, CalendarTodoPreviewItem[]>();

    todos.forEach((todo) => {
      if (!todo.dueDate?.startsWith(monthValue)) {
        return;
      }

      const items = entries.get(todo.dueDate) ?? [];
      items.push(todo);
      entries.set(todo.dueDate, items);
    });

    return entries;
  }, [monthValue, todos]);

  const today = getTodayDateInputInSeoul();
  const initialDate =
    selectedDate && selectedDate.startsWith(monthValue)
      ? selectedDate
      : today.startsWith(monthValue)
        ? today
        : Array.from(todoMap.keys()).sort()[0] ?? `${monthValue}-01`;
  const [previewDate, setPreviewDate] = useState(initialDate);
  const previewItems = todoMap.get(previewDate) ?? [];

  useEffect(() => {
    setPreviewDate(initialDate);
  }, [initialDate]);

  return (
    <section className="glass-panel rounded-[22px] p-5 md:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Calendar
        </p>
        <TodoCalendarMonthPicker value={monthValue} />
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
          const isSelected = selectedDate === date;
          const count = todoMap.get(date)?.length ?? 0;
          const params = new URLSearchParams(searchParams.toString());
          params.set("month", monthValue);
          params.set("date", date);

          return (
            <Link
              key={date}
              href={`${pathname}?${params.toString()}`}
              onMouseEnter={() => setPreviewDate(date)}
              onFocus={() => setPreviewDate(date)}
              className={cx(
                "relative flex h-11 items-center justify-center rounded-[0.95rem] border text-sm font-semibold transition",
                isSelected
                  ? "border-[rgba(110,168,254,0.45)] bg-[rgba(110,168,254,0.18)] text-[var(--foreground)] shadow-[0_0_0_1px_rgba(110,168,254,0.08)]"
                  : isPreview
                    ? "border-[rgba(110,168,254,0.35)] bg-[rgba(110,168,254,0.14)] text-[var(--foreground)]"
                  : "border-[var(--border)] bg-white/4 text-[var(--muted)] hover:bg-white/8 hover:text-[var(--foreground)]",
              )}
            >
              {day}
              {count > 0 ? (
                <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-[#6ea8fe]" />
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="mt-5 rounded-[18px] border border-[var(--border)] bg-white/4 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {previewDate.replaceAll("-", ".")}
          </p>
          <span className="text-xs font-medium text-[var(--muted)]">
            {previewItems.length} items
          </span>
        </div>

        <div className="mt-3 h-[10.5rem] overflow-y-auto pr-1">
          {previewItems.length === 0 ? (
            <div className="flex h-full items-center">
              <p className="text-sm leading-6 text-[var(--muted)]">
                이 날짜에는 마감 TODO가 없습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {previewItems.map((todo) => (
                <div
                  key={todo.id}
                  className="rounded-[14px] border border-[var(--border)] bg-black/10 px-3 py-2.5"
                >
                  <p
                    className={cx(
                      "text-sm font-medium",
                      todo.completed
                        ? "text-white/55 line-through"
                        : "text-[var(--foreground)]",
                    )}
                  >
                    {todo.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
