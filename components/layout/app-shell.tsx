import Image from "next/image";
import { Suspense } from "react";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { SidebarSummary } from "@/features/dashboard/components/sidebar-summary";
import { getDashboardSummary } from "@/features/dashboard/queries/get-dashboard-summary";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ResponsiveSidebar } from "@/components/layout/responsive-sidebar";
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
  const portfolioSwitcherFallback = (
    <div className="w-full max-w-[22rem] animate-pulse rounded-[1.15rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.025))] px-4 py-3">
      <div className="h-3 w-20 rounded-full bg-white/8" />
      <div className="mt-2 h-5 w-40 rounded-full bg-white/10" />
    </div>
  );
  const portfolioSwitcherPanel = (
    <Suspense fallback={portfolioSwitcherFallback}>
      <div className="w-full max-w-[22rem]">
        <PortfolioSwitcher
          portfolios={portfolios}
          compact
          defaultSelectedId={activePortfolio?.id}
        />
      </div>
    </Suspense>
  );

  return (
    <div className="page-shell admin-shell">
      <div className="page-container grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <ResponsiveSidebar className="admin-sidebar h-fit rounded-[24px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(8,14,28,.98),rgba(10,16,31,.96))] p-5 lg:self-start">
          <div className="flex min-h-full flex-col gap-5">
            <SettingsDialog
              trigger={
                <button
                  type="button"
                  className="flex w-full flex-col items-center rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-4 py-5 text-center transition hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))]"
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
                    <h1 className="text-[1.35rem] font-semibold leading-tight tracking-tight">
                      {settings.brandName}
                    </h1>
                    <p className="mt-1 text-[13px] text-[var(--muted)]">
                      {settings.brandSubtitle}
                    </p>
                  </div>
                </button>
              }
            >
              <SettingsPanel settings={settings} mode="brand" />
            </SettingsDialog>

            <div>
              <p className="px-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
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
                  className="w-full rounded-[18px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 text-left transition hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))]"
                >
                  <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/90">
                    오늘의 원칙
                  </h4>
                  <p className="mt-2.5 line-clamp-4 text-[13px] leading-6 text-[var(--muted)]">
                    {settings.monthlyPrinciple}
                  </p>
                </button>
              }
            >
              <SettingsPanel settings={settings} mode="principle" />
            </SettingsDialog>

            <div className="mt-auto space-y-3 pt-2">
              <SidebarSummary summary={summary} />
              <div className="rounded-[16px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-2.5">
                <LogoutButton />
              </div>
            </div>
          </div>
        </ResponsiveSidebar>

        <main className="min-w-0 2xl:grid 2xl:grid-cols-[minmax(0,1fr)_280px] 2xl:items-start 2xl:gap-4">
          <div className="space-y-6">
            <div className="glass-panel rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(12,19,37,.94),rgba(9,14,28,.96))] px-5 py-3.5 shadow-[0_14px_30px_rgba(2,8,23,.22)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#93a4c7]">
                Workspace
              </p>
              <p className="mt-1 text-[13px] text-[#dbe7ff]">
                포트폴리오 흐름과 기록 작업을 한 화면 흐름으로 정리했습니다.
              </p>
            </div>
            <div className="2xl:hidden">{portfolioSwitcherPanel}</div>
            <div className="space-y-6">{children}</div>
          </div>
          <div className="hidden 2xl:block 2xl:sticky 2xl:top-6 2xl:self-start 2xl:z-30">
            {portfolioSwitcherPanel}
          </div>
        </main>
      </div>
    </div>
  );
}
