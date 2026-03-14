import { cx } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const toneStyles = {
  default:
    "border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[#162218] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]/80",
  dark:
    "appearance-none border border-white/12 bg-[rgba(255,255,255,0.04)] px-3.5 py-2.5 text-sm text-white shadow-none [color-scheme:dark] [&>option]:bg-[#15203a] [&>option]:text-white focus:border-[#6ea8fe] focus:ring-4 focus:ring-[rgba(110,168,254,0.16)]",
} as const;

export function Select({
  className,
  tone = "default",
  ...props
}: Readonly<SelectProps & { tone?: keyof typeof toneStyles }>) {
  return (
    <select
      className={cx(
        "w-full rounded-[1rem] outline-none transition",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
