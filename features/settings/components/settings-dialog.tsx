"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

type SettingsDialogProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  stopPropagationOnTriggerClick?: boolean;
  dialogClassName?: string;
};

export function SettingsDialog({
  trigger,
  children,
  stopPropagationOnTriggerClick = false,
  dialogClassName,
}: Readonly<SettingsDialogProps>) {
  const [open, setOpen] = useState(false);
  const portalTarget = typeof document === "undefined" ? null : document.body;

  const dialog = open ? (
    <div className="admin-shell fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4">
      <div
        className={`relative w-full max-w-[560px] ${dialogClassName ?? ""}`.trim()}
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
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-[rgba(7,13,28,0.96)] text-base font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.32)] transition hover:border-white/20 hover:bg-[rgba(255,255,255,0.12)] sm:right-4 sm:top-4"
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
      <div
        onClick={(event) => {
          if (stopPropagationOnTriggerClick) {
            event.preventDefault();
            event.stopPropagation();
          }

          setOpen(true);
        }}
      >
        {trigger}
      </div>
      {portalTarget ? createPortal(dialog, portalTarget) : null}
    </>
  );
}
