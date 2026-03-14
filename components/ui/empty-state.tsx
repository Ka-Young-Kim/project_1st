export function EmptyState({
  title,
  description,
}: Readonly<{
  title: string;
  description: string;
}>) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-[rgba(255,255,255,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-6 py-10 text-center text-white">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}
