"use client";

import {
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type ConfirmSubmitButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> & {
  confirmMessage: string;
  children: ReactNode;
};

export function ConfirmSubmitButton({
  confirmMessage,
  children,
  className,
  onClick,
  ...buttonProps
}: Readonly<ConfirmSubmitButtonProps>) {
  const [open, setOpen] = useState(false);
  const [targetForm, setTargetForm] = useState<HTMLFormElement | null>(null);
  const portalTarget = typeof document === "undefined" ? null : document.body;

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }

    event.preventDefault();
    setTargetForm(event.currentTarget.form);
    setOpen(true);
  };

  const handleConfirm = () => {
    if (!targetForm) {
      setOpen(false);
      return;
    }

    if (typeof targetForm.requestSubmit === 'function') {
      targetForm.requestSubmit();
    } else {
      targetForm.submit();
    }

    setOpen(false);
  };

  const dialog = open ? (
    <div className="admin-shell fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(3,7,18,0.82)] p-4 backdrop-blur-md sm:p-6">
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.38)] sm:p-6">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-[rgba(7,13,28,0.96)] text-base font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.32)] transition hover:border-white/20 hover:bg-[rgba(255,255,255,0.12)]"
          aria-label="확인창 닫기"
        >
          ×
        </button>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea4cf]">
          Confirm Action
        </p>
        <h4 className="mt-2 text-[1.35rem] font-semibold tracking-tight text-white">
          삭제 확인
        </h4>
        <p className="mt-3 pr-10 text-sm leading-6 text-[#b9c8e6]">
          {confirmMessage}
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 min-w-[92px] items-center justify-center rounded-[0.95rem] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-[#dce7ff] transition hover:bg-white/10"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex h-10 min-w-[92px] items-center justify-center rounded-[0.95rem] border border-rose-300/30 bg-[linear-gradient(180deg,rgba(190,24,93,0.18),rgba(190,24,93,0.1))] px-4 text-sm font-semibold text-rose-100 transition hover:bg-[linear-gradient(180deg,rgba(190,24,93,0.24),rgba(190,24,93,0.14))]"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="submit"
        className={className}
        onClick={handleOpen}
        {...buttonProps}
      >
        {children}
      </button>
      {portalTarget ? createPortal(dialog, portalTarget) : null}
    </>
  );
}
