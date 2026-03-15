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
        "grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px] 2xl:gap-6",
        className,
      )}
    >
      <div className="min-w-0">{primary}</div>
      <aside className="min-w-0">{secondary}</aside>
    </div>
  );
}
