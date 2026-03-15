"use client";

import { useEffect, useState } from "react";

type DesktopWindowState = {
  isDesktopApp: boolean;
  isMaximized: boolean;
};

const defaultState: DesktopWindowState = {
  isDesktopApp: false,
  isMaximized: false,
};

export function DesktopWindowControls() {
  const [state, setState] = useState<DesktopWindowState>(defaultState);

  useEffect(() => {
    if (typeof window === "undefined" || !window.desktopShell) {
      return;
    }

    setState({
      isDesktopApp: window.desktopShell.isDesktopApp,
      isMaximized: window.desktopShell.isMaximized,
    });

    return window.desktopShell.subscribeWindowState((nextState) => {
      setState(nextState);
    });
  }, []);

  if (!state.isDesktopApp) {
    return null;
  }

  return (
    <div className="desktop-no-drag flex items-center gap-1">
      <DesktopWindowButton
        label="창 최소화"
        onClick={() => window.desktopShell?.minimize()}
      >
        <span className="block h-px w-3 bg-current" />
      </DesktopWindowButton>
      <DesktopWindowButton
        label={state.isMaximized ? "창 복원" : "창 최대화"}
        onClick={() => window.desktopShell?.toggleMaximize()}
      >
        {state.isMaximized ? (
          <span className="relative block h-3.5 w-3.5">
            <span className="absolute left-0 top-1 h-2.5 w-2.5 border border-current bg-transparent" />
            <span className="absolute right-0 top-0 h-2.5 w-2.5 border border-current bg-transparent" />
          </span>
        ) : (
          <span className="block h-3.5 w-3.5 border border-current" />
        )}
      </DesktopWindowButton>
      <DesktopWindowButton
        label="앱 닫기"
        onClick={() => window.desktopShell?.close()}
        tone="danger"
      >
        <span className="relative block h-3.5 w-3.5">
          <span className="absolute left-1/2 top-0 h-3.5 w-px -translate-x-1/2 rotate-45 bg-current" />
          <span className="absolute left-1/2 top-0 h-3.5 w-px -translate-x-1/2 -rotate-45 bg-current" />
        </span>
      </DesktopWindowButton>
    </div>
  );
}

function DesktopWindowButton({
  children,
  label,
  onClick,
  tone = "default",
}: Readonly<{
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
}>) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-[0.7rem] border text-[#a9bddf] transition ${
        tone === "danger"
          ? "border-rose-300/16 bg-rose-400/8 hover:border-rose-300/28 hover:bg-rose-400/14 hover:text-rose-100"
          : "border-white/8 bg-white/4 hover:border-white/14 hover:bg-white/8 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
