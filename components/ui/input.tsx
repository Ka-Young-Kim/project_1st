import { cx } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const toneStyles = {
  default:
    "border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[#162218] placeholder:text-zinc-400 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]",
  dark:
    "appearance-none border border-white/12 bg-[rgba(255,255,255,0.04)] px-3.5 py-2.5 text-sm text-white placeholder:text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-4 focus:ring-[rgba(110,168,254,0.16)]",
} as const;

export function Input({
  className,
  tone = "default",
  ...props
}: Readonly<InputProps & { tone?: keyof typeof toneStyles }>) {
  return (
    <input
      className={cx(
        "w-full rounded-[1rem] outline-none transition",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
