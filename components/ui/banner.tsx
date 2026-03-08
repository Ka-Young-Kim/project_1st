import { cx } from "@/lib/utils";

const toneStyles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-amber-200 bg-amber-50 text-amber-800",
} as const;

export function Banner({
  children,
  tone = "info",
}: Readonly<{
  children: React.ReactNode;
  tone?: keyof typeof toneStyles;
}>) {
  return (
    <div
      className={cx(
        "rounded-2xl border px-4 py-3 text-sm font-medium",
        toneStyles[tone],
      )}
    >
      {children}
    </div>
  );
}
