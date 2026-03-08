"use client";

import { useFormStatus } from "react-dom";

import { cx } from "@/lib/utils";

export function SubmitButton({
  children,
  pendingLabel = "저장 중...",
  className,
}: Readonly<{
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}>) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cx(
        "inline-flex items-center justify-center rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
