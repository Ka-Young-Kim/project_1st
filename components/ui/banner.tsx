import { cx } from "@/lib/utils";

const toneStyles = {
  success:
    "border-[rgba(124,242,201,0.18)] bg-[rgba(124,242,201,0.08)] text-[#bdf6e4]",
  error:
    "border-[rgba(255,125,125,0.2)] bg-[rgba(255,125,125,0.08)] text-[#ffc3c3]",
  info: "border-[rgba(255,203,107,0.18)] bg-[rgba(255,203,107,0.08)] text-[#ffe0a3]",
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
        "inline-flex max-w-fit items-center rounded-full border px-3 py-2 text-sm font-medium shadow-[0_10px_30px_rgba(0,0,0,.12)] backdrop-blur-sm",
        toneStyles[tone],
      )}
    >
      {children}
    </div>
  );
}
