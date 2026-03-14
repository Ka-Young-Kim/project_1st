"use client";

import { useEffect, useState } from "react";

import { cx } from "@/lib/utils";

const toneStyles = {
  success:
    "border-[rgba(124,242,201,0.18)] bg-[linear-gradient(180deg,rgba(10,33,29,0.96),rgba(7,24,22,0.98))] text-[#bdf6e4]",
  error:
    "border-[rgba(255,125,125,0.2)] bg-[linear-gradient(180deg,rgba(43,18,24,0.96),rgba(27,11,15,0.98))] text-[#ffc3c3]",
  info:
    "border-[rgba(255,203,107,0.18)] bg-[linear-gradient(180deg,rgba(44,31,14,0.96),rgba(29,21,10,0.98))] text-[#ffe0a3]",
} as const;

export function StatusToast({
  children,
  tone = "info",
}: Readonly<{
  children: React.ReactNode;
  tone?: keyof typeof toneStyles;
}>) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("status");
    window.history.replaceState({}, "", url);

    const closeTimer = window.setTimeout(() => setOpen(false), 1800);
    return () => window.clearTimeout(closeTimer);
  }, []);

  if (!open) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-8 top-8 z-50">
      <div
        className={cx(
          "inline-flex max-w-[28rem] items-center rounded-[1.2rem] border px-4 py-3 text-sm font-medium shadow-[0_24px_64px_rgba(0,0,0,.32)] backdrop-blur-md transition-opacity",
          toneStyles[tone],
        )}
      >
        {children}
      </div>
    </div>
  );
}
