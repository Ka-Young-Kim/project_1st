"use client";

import { useEffect, useState } from "react";

import { cx } from "@/lib/utils";

const toneStyles = {
  success:
    "border-[rgba(124,242,201,0.18)] bg-[rgba(10,33,29,0.92)] text-[#bdf6e4]",
  error:
    "border-[rgba(255,125,125,0.2)] bg-[rgba(43,18,24,0.92)] text-[#ffc3c3]",
  info: "border-[rgba(255,203,107,0.18)] bg-[rgba(44,31,14,0.92)] text-[#ffe0a3]",
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
    <div className="pointer-events-none fixed right-5 top-5 z-50">
      <div
        className={cx(
          "inline-flex max-w-[24rem] items-center rounded-full border px-3.5 py-2.5 text-sm font-medium shadow-[0_18px_40px_rgba(0,0,0,.28)] backdrop-blur-md transition-opacity",
          toneStyles[tone],
        )}
      >
        {children}
      </div>
    </div>
  );
}
