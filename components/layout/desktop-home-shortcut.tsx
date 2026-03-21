"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cx } from "@/lib/utils";

export function DesktopHomeShortcut({
  defaultPortfolioId,
}: Readonly<{
  defaultPortfolioId?: string;
}>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get("portfolio") ?? defaultPortfolioId;
  const href = portfolioId
    ? `/?${new URLSearchParams({ portfolio: portfolioId }).toString()}`
    : "/";
  const isActive = pathname === "/";

  return (
    <Link
      href={href}
      aria-label="포트폴리오 홈"
      title="포트폴리오 홈"
      aria-current={isActive ? "page" : undefined}
      className={cx(
        "inline-flex w-14 shrink-0 self-stretch items-center justify-center rounded-[1.15rem] border transition",
        isActive
          ? "border-[rgba(110,168,254,0.24)] bg-[rgba(110,168,254,0.14)] text-white"
          : "border-[var(--border)] bg-white/4 text-[#a8bbdd] hover:bg-white/8 hover:text-white",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4.5 10.5 12 4l7.5 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-3.5v-5h-5v5H6A1.5 1.5 0 0 1 4.5 19v-8.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
