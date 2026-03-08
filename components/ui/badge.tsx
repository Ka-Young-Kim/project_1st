import { cx } from "@/lib/utils";

const badgeStyles = {
  low: "bg-stone-100 text-stone-700",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-800",
  buy: "bg-emerald-100 text-emerald-800",
  sell: "bg-sky-100 text-sky-800",
  done: "bg-emerald-100 text-emerald-800",
  open: "bg-zinc-100 text-zinc-700",
} as const;

export function Badge({
  children,
  tone,
}: Readonly<{
  children: React.ReactNode;
  tone: keyof typeof badgeStyles;
}>) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        badgeStyles[tone],
      )}
    >
      {children}
    </span>
  );
}
