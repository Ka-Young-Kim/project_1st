import { DesktopWindowControls } from "@/components/layout/desktop-window-controls";

export function DesktopTopbar({
  identity,
  pageHeader,
  children,
}: Readonly<{
  identity?: React.ReactNode;
  pageHeader?: React.ReactNode;
  children?: React.ReactNode;
}>) {
  return (
    <header className="desktop-topbar desktop-drag">
      <div className="desktop-topbar-main">
        {identity ? <div className="desktop-no-drag min-w-0">{identity}</div> : null}
        {pageHeader ? <div className="desktop-no-drag min-w-0">{pageHeader}</div> : null}
      </div>

      <div className="desktop-no-drag inline-flex w-fit max-w-full justify-self-end items-center justify-end gap-3">
        {children}
        <DesktopWindowControls />
      </div>
    </header>
  );
}
