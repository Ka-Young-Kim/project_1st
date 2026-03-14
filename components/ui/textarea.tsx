import { cx } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const toneStyles = {
  default:
    "border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[#162218] placeholder:text-zinc-400 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]/80",
  dark:
    "border border-white/12 bg-[rgba(255,255,255,0.04)] px-3.5 py-2.5 text-sm text-white placeholder:text-[#6f83aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-4 focus:ring-[rgba(110,168,254,0.16)]",
} as const;

export function Textarea({
  className,
  tone = "default",
  ...props
}: Readonly<TextareaProps & { tone?: keyof typeof toneStyles }>) {
  return (
    <textarea
      className={cx(
        "min-h-24 w-full rounded-[1rem] outline-none transition",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
