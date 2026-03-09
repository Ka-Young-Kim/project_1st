"use client";

import { useState } from "react";

import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { cx } from "@/lib/utils";

type InvestmentItemRowProps = {
  categoryLabel: string;
  industry: string | null;
  code: string;
  name: string;
  logCount: number;
  isHolding: boolean;
  children: React.ReactNode;
};

export function InvestmentItemRow({
  categoryLabel,
  industry,
  code,
  name,
  logCount,
  isHolding,
  children,
}: Readonly<InvestmentItemRowProps>) {
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedToast(`${code} 복사`);
      window.setTimeout(() => setCopiedToast(null), 1200);
    } catch {}
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-[1.05rem] border border-transparent bg-[linear-gradient(180deg,rgba(255,255,255,0.015),rgba(255,255,255,0.02))] px-4 py-3 transition hover:border-[rgba(143,176,236,0.18)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.03))]">
        <button
          type="button"
          onClick={handleCopyCode}
          className="min-w-0 flex-1 rounded-[0.95rem] text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[#6ea8fe]/30 focus-visible:ring-inset"
          aria-label={`${code} 코드 복사`}
        >
          <div className="mb-2 flex min-w-0 items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/6 px-2 py-1 text-[11px] leading-none text-[#d6e4ff]">
                {categoryLabel}
              </span>
              {industry
                ?.split(",")
                .map((entry) => entry.trim())
                .filter(Boolean)
                .map((entry) => (
                  <span
                    key={entry}
                    className="rounded-full bg-white/4 px-2 py-1 text-[11px] leading-none text-[#9db2d8]"
                  >
                    {entry}
                  </span>
                ))}
            </div>
            <div className="flex shrink-0 items-center gap-2 text-[10px] text-[#7188b4]">
              <span className="rounded-full bg-[#6ea8fe]/10 px-2 py-1 leading-none text-[#bcd3ff]">
                로그 {logCount}건
              </span>
              <span
                className={cx(
                  "rounded-full px-2 py-1 leading-none",
                  isHolding
                    ? "bg-emerald-400/10 text-emerald-200"
                    : "bg-white/6 text-[#9aaed3]",
                )}
              >
                {isHolding ? "보유중" : "미보유"}
              </span>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <span className="rounded-full border border-[#8fb0ec]/18 bg-[#8fb0ec]/10 px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.08em] text-[#d9e8ff]">
              {code}
            </span>
            <p className="truncate text-[1rem] font-semibold leading-none tracking-tight text-white">
              {name}
            </p>
          </div>
        </button>

        <SettingsDialog
          trigger={
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/4 text-sm leading-none text-[#7d93bf] transition hover:border-[#8fb0ec]/22 hover:bg-[#6ea8fe]/10 hover:text-[#d9e8ff]"
              aria-label={`${name} 수정 열기`}
            >
              ›
            </button>
          }
        >
          {children}
        </SettingsDialog>
      </div>

      {copiedToast ? (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#8fb6ff]/20 bg-[rgba(18,30,58,0.96)] px-4 py-2 text-sm font-medium text-[#d9e8ff] shadow-[0_14px_40px_rgba(0,0,0,.28)]">
          {copiedToast}
        </div>
      ) : null}
    </>
  );
}
