import Image from "next/image";
import { Suspense } from "react";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { SidebarSummary } from "@/features/dashboard/components/sidebar-summary";
import { getDashboardSummary } from "@/features/dashboard/queries/get-dashboard-summary";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { PortfolioSwitcher } from "@/features/portfolios/components/portfolio-switcher";
import { resolvePortfolioId } from "@/features/portfolios/queries/get-portfolios";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { SettingsPanel } from "@/features/settings/components/settings-panel";
import { getAppSettings } from "@/features/settings/services/settings-service";

export async function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getAppSettings();
  const [summary, { portfolios, activePortfolio }] = await Promise.all([
    getDashboardSummary(),
    resolvePortfolioId(),
  ]);
  const brandInitial = settings.brandName.trim().charAt(0) || "₩";

  return (
    <div className="page-shell admin-shell">
      <div className="page-container grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="admin-sidebar h-fit rounded-[22px] p-5 lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] lg:overflow-y-auto lg:rounded-[22px] lg:border lg:border-[var(--border)]">
          <div className="flex min-h-full flex-col gap-6">
            <SettingsDialog
              trigger={
                <button
                  type="button"
                  className="flex w-full flex-col items-center rounded-[24px] border border-[var(--border)] bg-white/3 px-4 py-6 text-center transition hover:bg-white/5"
                >
                  {settings.brandImageUrl ? (
                    <div className="overflow-hidden rounded-full shadow-[0_14px_40px_rgba(0,0,0,.28)]">
                      <Image
                        src={settings.brandImageUrl}
                        alt={`${settings.brandName} 로고`}
                        className="h-14 w-14 rounded-full object-cover"
                        width={56}
                        height={56}
                      />
                    </div>
                  ) : (
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(135deg,#6ea8fe,#7cf2c9)] text-xl font-extrabold text-[#08111f] shadow-[0_14px_40px_rgba(0,0,0,.28)]">
                      {brandInitial}
                    </div>
                  )}
                  <div className="mt-4">
                    <h1 className="text-xl font-semibold leading-tight">
                      {settings.brandName}
                    </h1>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {settings.brandSubtitle}
                    </p>
                  </div>
                </button>
              }
            >
              <SettingsPanel settings={settings} mode="brand" />
            </SettingsDialog>

            <div>
              <p className="px-3 text-xs uppercase tracking-[0.08em] text-[var(--muted)]">
                Main
              </p>
              <div className="mt-3">
                <Suspense fallback={null}>
                  <SidebarNav defaultPortfolioId={activePortfolio?.id} />
                </Suspense>
              </div>
            </div>

            <SettingsDialog
              trigger={
                <button
                  type="button"
                  className="w-full rounded-[18px] border border-[var(--border)] bg-white/3 p-4 text-left transition hover:bg-white/5"
                >
                  <h4 className="text-sm font-semibold text-white/90">오늘의 원칙</h4>
                  <p className="mt-2 line-clamp-4 text-sm leading-6 text-[var(--muted)]">
                    {settings.monthlyPrinciple}
                  </p>
                </button>
              }
            >
              <SettingsPanel settings={settings} mode="principle" />
            </SettingsDialog>

            <div className="mt-auto space-y-3 pt-2">
              <SidebarSummary summary={summary} />
              <div className="rounded-[18px] border border-[var(--border)] bg-white/3 p-3">
                <LogoutButton />
              </div>
            </div>
          </div>
        </aside>

        <main className="space-y-6 p-6">
          <div className="flex justify-end">
            <Suspense fallback={null}>
              <PortfolioSwitcher
                portfolios={portfolios}
                compact
                defaultSelectedId={activePortfolio?.id}
              />
            </Suspense>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
