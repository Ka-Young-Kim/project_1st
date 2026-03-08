export function EmptyState({
  title,
  description,
}: Readonly<{
  title: string;
  description: string;
}>) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] bg-white/55 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}
