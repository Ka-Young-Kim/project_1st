type SidebarSummaryProps = {
  summary: {
    monthLabel: string;
    monthlyBuyCount: number;
    monthlySellCount: number;
  };
};

const items = (summary: SidebarSummaryProps["summary"]) => [
  {
    label: "매수",
    value: summary.monthlyBuyCount,
    tone: "text-[#cfe1ff]",
  },
  {
    label: "매도",
    value: summary.monthlySellCount,
    tone: "text-[#ffcb6b]",
  },
];

export function SidebarSummary({ summary }: Readonly<SidebarSummaryProps>) {
  return (
    <section className="rounded-[18px] border border-[var(--border)] bg-white/3 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        Quick Stats
      </p>
      <p className="mt-3 text-sm font-semibold text-white/88">{summary.monthLabel}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {items(summary).map((item, index, array) => (
          <div
            key={item.label}
            className={`rounded-[14px] border border-[var(--border)] bg-black/10 px-3 py-2.5 ${
              array.length % 2 === 1 && index === array.length - 1 ? "col-span-2" : ""
            }`}
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
