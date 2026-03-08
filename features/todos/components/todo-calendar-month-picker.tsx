"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type TodoCalendarMonthPickerProps = {
  value: string;
};

export function TodoCalendarMonthPicker({
  value,
}: Readonly<TodoCalendarMonthPickerProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [year, month] = value.split("-").map(Number);
  const years = useMemo(
    () => Array.from({ length: 9 }, (_, index) => year - 4 + index),
    [year],
  );

  function updateMonth(nextYear: number, nextMonth: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(
      "month",
      `${nextYear}-${String(nextMonth).padStart(2, "0")}`,
    );
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mt-2 inline-flex items-center gap-2 rounded-[1.1rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(22,32,58,.96),rgba(20,29,53,.96))] px-3 py-2.5">
      <select
        aria-label="연도 선택"
        value={year}
        onChange={(event) => updateMonth(Number(event.target.value), month)}
        className="appearance-none bg-transparent text-lg font-semibold text-[var(--foreground)] outline-none"
      >
        {years.map((item) => (
          <option key={item} value={item} className="bg-[#141d35] text-white">
            {item}년
          </option>
        ))}
      </select>

      <span className="text-white/30">/</span>

      <select
        aria-label="월 선택"
        value={month}
        onChange={(event) => updateMonth(year, Number(event.target.value))}
        className="appearance-none bg-transparent text-lg font-semibold text-[var(--foreground)] outline-none"
      >
        {Array.from({ length: 12 }, (_, index) => index + 1).map((item) => (
          <option
            key={item}
            value={item}
            className="bg-[#141d35] text-white"
          >
            {String(item).padStart(2, "0")}월
          </option>
        ))}
      </select>
    </div>
  );
}
