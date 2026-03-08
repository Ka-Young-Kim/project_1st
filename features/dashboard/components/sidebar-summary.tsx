type SidebarSummaryProps = {
  summary: {
    incompleteTodoCount: number;
    dueTodayCount: number;
    monthlyTradeCount: number;
    totalTodoCount: number;
  };
};

const items = (summary: SidebarSummaryProps["summary"]) => [
  { label: "미완료", value: summary.incompleteTodoCount, tone: "text-white" },
  { label: "오늘 마감", value: summary.dueTodayCount, tone: "text-[#ffcb6b]" },
  { label: "이번 달 거래", value: summary.monthlyTradeCount, tone: "text-[#7cf2c9]" },
  { label: "전체 TODO", value: summary.totalTodoCount, tone: "text-[#cfe1ff]" },
];

export function SidebarSummary({ summary }: Readonly<SidebarSummaryProps>) {
  return (
    <section className="rounded-[18px] border border-[var(--border)] bg-white/3 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        Quick Stats
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {items(summary).map((item) => (
          <div
            key={item.label}
            className="rounded-[14px] border border-[var(--border)] bg-black/10 px-3 py-2.5"
          >
            <p className="text-[11px] font-medium text-[var(--muted)]">
              {item.label}
            </p>
            <p className={`mt-1 text-lg font-semibold ${item.tone}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
