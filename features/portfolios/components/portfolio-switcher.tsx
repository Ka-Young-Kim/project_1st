"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PORTFOLIO_SELECTION_COOKIE } from "@/features/portfolios/lib/selection";

type PortfolioOption = {
  id: string;
  name: string;
};

export function PortfolioSwitcher({
  portfolios,
  compact = false,
  defaultSelectedId,
}: Readonly<{
  portfolios: PortfolioOption[];
  compact?: boolean;
  defaultSelectedId?: string;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId =
    searchParams.get("portfolio") ?? defaultSelectedId ?? portfolios[0]?.id ?? "";

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    document.cookie = `${PORTFOLIO_SELECTION_COOKIE}=${selectedId}; path=/; max-age=31536000; samesite=lax`;
  }, [selectedId]);

  if (portfolios.length === 0) {
    return null;
  }

  return (
    <div
      className={
        compact
          ? "flex w-full min-w-0 items-center justify-between gap-3 rounded-[1.15rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-4 py-3"
          : "rounded-[1.4rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4"
      }
    >
      <div className={compact ? "min-w-0 flex-1" : ""}>
        <p
          className={
            compact
              ? "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#93a4c7]"
              : "text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]"
          }
        >
          Portfolio
        </p>
        <div className={compact ? "relative mt-1 min-w-0" : ""}>
          <select
            aria-label="포트폴리오 선택"
            value={selectedId}
            onChange={(event) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("portfolio", event.target.value);
              document.cookie = `${PORTFOLIO_SELECTION_COOKIE}=${event.target.value}; path=/; max-age=31536000; samesite=lax`;
              router.push(`${pathname}?${params.toString()}`);
            }}
            className={
              compact
                ? "w-full min-w-0 appearance-none bg-transparent pl-1 pr-7 text-sm font-semibold text-white outline-none"
                : "mt-3 w-full appearance-none rounded-[1rem] border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm font-semibold text-white outline-none"
            }
          >
            {portfolios.map((portfolio) => (
              <option
                key={portfolio.id}
                value={portfolio.id}
                className="bg-[#141d35] text-white"
              >
                {portfolio.name}
              </option>
            ))}
          </select>
          {compact ? (
            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#7f93bd]">
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m5 7.5 5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          ) : null}
        </div>
      </div>
      <Link
        href={
          selectedId
            ? `/portfolio-hub?${new URLSearchParams({ portfolio: selectedId }).toString()}`
            : "/portfolio-hub"
        }
        aria-label="포트폴리오 허브"
        className={
          compact
            ? "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white/4 text-[#9fb0d3] transition hover:bg-white/8 hover:text-white"
            : "mt-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/4 text-[#9fb0d3] transition hover:bg-white/8 hover:text-white"
        }
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
          <path
            d="M12 4 4.5 8v8L12 20l7.5-4V8L12 4Zm0 0v16M4.5 8 12 12l7.5-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}
