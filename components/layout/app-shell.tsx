import Image from "next/image";
import { Suspense } from "react";

import { DesktopHomeShortcut } from "@/components/layout/desktop-home-shortcut";
import { DesktopPageHeader } from "@/components/layout/desktop-page-header";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { SidebarSummary } from "@/features/dashboard/components/sidebar-summary";
import { getDashboardSummary } from "@/features/dashboard/queries/get-dashboard-summary";
import { DesktopTopbar } from "@/components/layout/desktop-topbar";
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
  const { portfolios, activePortfolio } = await resolvePortfolioId();
  const summary = await getDashboardSummary(activePortfolio?.id);
  const brandInitial = settings.brandName.trim().charAt(0) || "₩";
  const portfolioSwitcherFallback = (
    <div className="h-10 w-[18rem] animate-pulse rounded-[0.95rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.025))] px-4 py-3">
      <div className="h-3 w-20 rounded-full bg-white/8" />
    </div>
  );
  const portfolioSwitcherPanel = (
    <Suspense fallback={portfolioSwitcherFallback}>
      <div className="flex items-stretch gap-3 desktop-no-drag">
        <div className="w-[18rem] max-w-full">
          <PortfolioSwitcher
            portfolios={portfolios}
            compact
            defaultSelectedId={activePortfolio?.id}
          />
        </div>
        <DesktopHomeShortcut defaultPortfolioId={activePortfolio?.id} />
      </div>
    </Suspense>
  );
  const identityPanel = (
    <SettingsDialog
      trigger={
        <button
          type="button"
          className="min-h-[6rem] w-full rounded-[1.55rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.035))] px-4 py-[1.15rem] text-left shadow-[0_12px_30px_rgba(0,0,0,.18)] transition hover:border-white/12 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.05))]"
        >
          <div className="flex items-center gap-3.5">
            {settings.brandImageUrl ? (
              <div className="relative h-14 w-14 overflow-hidden rounded-[1rem] shadow-[0_12px_28px_rgba(0,0,0,.24)]">
                <Image
                  src={settings.brandImageUrl}
                  alt={`${settings.brandName} 로고`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="grid h-14 w-14 place-items-center rounded-[1rem] bg-[linear-gradient(135deg,#6ea8fe,#7cf2c9)] text-base font-extrabold text-[#08111f] shadow-[0_12px_28px_rgba(0,0,0,.24)]">
                {brandInitial}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold tracking-tight text-white">
                {settings.brandName}
              </p>
              <p className="mt-1 truncate text-[13px] text-[#8ea4cf]">
                {settings.brandSubtitle}
              </p>
            </div>
          </div>
        </button>
      }
    >
      <SettingsPanel settings={settings} mode="brand" />
    </SettingsDialog>
  );

  return (
    <div className="page-shell admin-shell desktop-shell">
      <DesktopTopbar
        identity={identityPanel}
        pageHeader={
          <DesktopPageHeader
            brandName={settings.brandName}
            activePortfolioName={activePortfolio?.name}
            className="space-y-2"
          />
        }
      >
        {portfolioSwitcherPanel}
      </DesktopTopbar>

      <div className="page-container desktop-shell-body">
        <ResponsiveSidebar className="admin-sidebar desktop-sidebar h-fit rounded-[24px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(8,14,28,.98),rgba(10,16,31,.96))] p-4 lg:self-start">
          <div className="flex min-h-full flex-col gap-5">
            <div>
              <p className="px-2 text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                Main
              </p>
              <div className="mt-3">
                <Suspense fallback={null}>
                  <SidebarNav defaultPortfolioId={activePortfolio?.id} />
                </Suspense>
              </div>
            </div>

            <div className="mt-auto space-y-3 pt-2">
              <SidebarSummary summary={summary} />
              <div className="rounded-[16px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-2.5">
                <LogoutButton />
              </div>
            </div>
          </div>
        </ResponsiveSidebar>

        <main className="desktop-main min-w-0">
          <div className="space-y-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
