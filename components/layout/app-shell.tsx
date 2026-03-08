import Link from "next/link";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { NAV_ITEMS } from "@/lib/constants";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="page-shell">
      <div className="page-container grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="glass-panel h-fit rounded-[2rem] p-5 lg:sticky lg:top-6">
          <div className="space-y-5">
            <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#214f39,#103120)] p-5 text-[#f8f2e6]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Finance Command
              </p>
              <h1 className="mt-3 text-2xl font-bold">Project 1st</h1>
              <p className="mt-2 text-sm leading-6 text-white/74">
                할 일과 투자 판단을 같은 기록 체계로 관리합니다.
              </p>
            </div>

            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl border border-[var(--border)] bg-white/65 px-4 py-3 text-sm font-medium transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                >
                  <span className="block">{item.label}</span>
                  <span className="mt-1 block text-xs text-[var(--muted)]">
                    {item.description}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                Rules
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                <li>Timezone: Asia/Seoul</li>
                <li>Currency: KRW</li>
                <li>Delete policy: hard delete</li>
              </ul>
            </div>

            <LogoutButton />
          </div>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
