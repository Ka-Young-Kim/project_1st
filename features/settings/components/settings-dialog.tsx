"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

type SettingsDialogProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
};

export function SettingsDialog({
  trigger,
  children,
}: Readonly<SettingsDialogProps>) {
  const [open, setOpen] = useState(false);
  const portalTarget = typeof document === "undefined" ? null : document.body;

  const dialog = open ? (
    <div className="admin-shell fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4">
      <div
        className="relative w-full max-w-[560px]"
        onClick={(event) => {
          const target = event.target;
          if (
            target instanceof HTMLElement &&
            target.closest('[data-dialog-close="true"]')
          ) {
            setOpen(false);
          }
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(11,16,32,0.92)] text-sm font-semibold text-white transition hover:bg-[rgba(255,255,255,0.08)] sm:right-4 sm:top-4"
          aria-label="설정 닫기"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  ) : null;

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      {portalTarget ? createPortal(dialog, portalTarget) : null}
    </>
  );
}
