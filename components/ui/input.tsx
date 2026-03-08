import { cx } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Readonly<InputProps>) {
  return (
    <input
      className={cx(
        "w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[#162218] outline-none transition placeholder:text-zinc-400 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]/80",
        className,
      )}
      {...props}
    />
  );
}
