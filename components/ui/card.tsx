import { cx } from "@/lib/utils";

export function Card({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <section className={cx("glass-panel rounded-[2rem] p-6", className)}>
      {children}
    </section>
  );
}
