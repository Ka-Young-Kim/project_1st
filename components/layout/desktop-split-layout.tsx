import { cx } from "@/lib/utils";

export function DesktopSplitLayout({
  primary,
  secondary,
  className,
}: Readonly<{
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={cx(
        "grid gap-5 desktop-split-layout",
        className,
      )}
    >
      <div className="min-w-0">{primary}</div>
      <aside className="min-w-0">{secondary}</aside>
    </div>
  );
}
