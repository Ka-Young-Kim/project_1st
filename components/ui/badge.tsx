import { cx } from "@/lib/utils";

const badgeStyles = {
  low: "border border-white/10 bg-white/6 text-[#d3ddf0]",
  medium: "border border-[rgba(255,203,107,0.18)] bg-[rgba(255,203,107,0.12)] text-[#ffe3ad]",
  high: "border border-[rgba(255,125,125,0.2)] bg-[rgba(255,125,125,0.12)] text-[#ffc7c7]",
  buy: "border border-[rgba(124,242,201,0.18)] bg-[rgba(124,242,201,0.12)] text-[#c9f9ea]",
  sell: "border border-[rgba(143,182,255,0.2)] bg-[rgba(143,182,255,0.12)] text-[#d7e5ff]",
  done: "border border-[rgba(124,242,201,0.18)] bg-[rgba(124,242,201,0.12)] text-[#c9f9ea]",
  info: "border border-[rgba(110,168,254,0.2)] bg-[rgba(110,168,254,0.12)] text-[#d4e5ff]",
  open: "border border-white/10 bg-white/6 text-[#d3ddf0]",
  overdue: "border border-[rgba(255,125,125,0.2)] bg-[rgba(255,125,125,0.12)] text-[#ffc7c7]",
} as const;

export function Badge({
  children,
  tone,
  compact = false,
}: Readonly<{
  children: React.ReactNode;
  tone: keyof typeof badgeStyles;
  compact?: boolean;
}>) {
  return (
    <span
      className={cx(
        compact
          ? "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
          : "inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]",
        badgeStyles[tone],
      )}
    >
      {children}
    </span>
  );
}
