"use client";

import { useFormStatus } from "react-dom";

import { cx } from "@/lib/utils";

const toneStyles = {
  primary:
    "bg-[linear-gradient(180deg,#76aefd,#5a8ee6)] text-white shadow-[0_16px_32px_rgba(90,142,230,0.26)] hover:bg-[linear-gradient(180deg,#86b8ff,#6798ea)]",
  secondary:
    "border border-[var(--border)] bg-white/6 text-[#d9e8ff] hover:bg-white/10",
} as const;

const sizeStyles = {
  md: "min-h-10 px-3.5 py-2.5 text-sm",
  sm: "min-h-9 px-3 py-2 text-sm",
} as const;

export function SubmitButton({
  children,
  pendingLabel = "저장 중...",
  className,
  tone = "primary",
  size = "md",
}: Readonly<{
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  tone?: keyof typeof toneStyles;
  size?: keyof typeof sizeStyles;
}>) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cx(
        "inline-flex items-center justify-center rounded-[1rem] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
