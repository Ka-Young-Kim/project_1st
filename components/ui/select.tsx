import { cx } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: Readonly<SelectProps>) {
  return (
    <select
      className={cx(
        "w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]/80",
        className,
      )}
      {...props}
    />
  );
}
