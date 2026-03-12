export default function PortfolioSnapshotsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="h-6 w-28 rounded-full bg-white/10" />
          <div className="h-10 w-48 rounded-xl bg-white/10" />
          <div className="h-5 w-80 max-w-full rounded-lg bg-white/8" />
        </div>
        <div className="h-12 w-56 rounded-[1rem] bg-white/10" />
      </div>

      <div className="rounded-[1.4rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,29,53,.92),rgba(17,26,48,.94))] px-5 py-4 shadow-[0_14px_40px_rgba(0,0,0,.22)]">
        <div className="h-4 w-28 rounded bg-white/10" />
        <div className="mt-3 h-8 w-56 rounded-lg bg-white/10" />
        <div className="mt-3 h-5 w-72 max-w-full rounded-lg bg-white/8" />
      </div>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(17,26,48,.96))] p-6 text-white shadow-[0_14px_40px_rgba(0,0,0,.28)]">
        <div className="h-4 w-20 rounded bg-white/10" />
        <div className="mt-3 h-8 w-40 rounded-lg bg-white/10" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-wrap items-start justify-between gap-3 rounded-[1.2rem] border border-[var(--border)] bg-white/4 p-4"
            >
              <div className="space-y-2">
                <div className="h-6 w-28 rounded-lg bg-white/10" />
                <div className="h-4 w-40 rounded bg-white/8" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-28 rounded bg-white/8" />
                <div className="h-5 w-14 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
