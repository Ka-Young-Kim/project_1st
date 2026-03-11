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
          ? "inline-flex items-center gap-4 rounded-[1rem] border border-[var(--border)] bg-white/4 px-3 py-2.5"
          : "rounded-[18px] border border-[var(--border)] bg-white/3 p-4"
      }
    >
      <p
        className={
          compact
            ? "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#93a4c7]"
            : "text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]"
        }
      >
        Portfolio
      </p>
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
            ? "min-w-[11rem] appearance-none bg-transparent pr-6 text-sm font-semibold text-white outline-none"
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
      <Link
        href={
          selectedId
            ? `/portfolio-hub?${new URLSearchParams({ portfolio: selectedId }).toString()}`
            : "/portfolio-hub"
        }
        aria-label="포트폴리오 허브"
        className={
          compact
            ? "inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-white/4 text-[#9fb0d3] transition hover:bg-white/8 hover:text-white"
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
