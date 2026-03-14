import { cx } from "@/lib/utils";

const surfaceStyles = {
  glass: "glass-panel rounded-[1.5rem] p-4",
  panel:
    "glass-panel rounded-[var(--card-radius)] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(14,22,42,.98))] p-4 text-white shadow-[0_14px_38px_rgba(2,8,23,.28)]",
  soft:
    "rounded-[var(--card-radius-tight)] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.03))] p-4 text-white shadow-[0_10px_24px_rgba(2,8,23,.16)]",
  metric:
    "rounded-[var(--card-radius-tight)] border border-[rgba(255,255,255,.08)] bg-[linear-gradient(180deg,rgba(24,35,63,.98),rgba(20,30,56,.96))] p-4 text-white shadow-[0_12px_30px_rgba(2,8,23,.24)]",
  dialog:
    "rounded-[var(--card-radius)] border border-[rgba(255,255,255,.1)] bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(14,22,42,1))] p-5 text-white shadow-[0_18px_48px_rgba(2,8,23,.34)]",
} as const;

export function Card({
  children,
  className,
  surface = "panel",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  surface?: keyof typeof surfaceStyles;
}>) {
  return (
    <section className={cx(surfaceStyles[surface], className)}>
      {children}
    </section>
  );
}
