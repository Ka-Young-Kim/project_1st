"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { NAV_ITEMS } from "@/lib/constants";
import { cx } from "@/lib/utils";

function NavIcon({ href, active }: Readonly<{ href: string; active: boolean }>) {
  const tone =
    href === "/todos"
      ? active
        ? "#ffcb6b"
        : "#d9b766"
      : active
        ? "#6ea8fe"
        : "#93a4c7";

  if (href === "/") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z" fill={tone} />
      </svg>
    );
  }

  if (href === "/todos") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d="M7 6.5h10M7 12h10M7 17.5h10M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01"
          stroke={tone}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (href === "/items") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d="M6.5 7.5h11M6.5 12h11M6.5 16.5h7M4 7.5h.01M4 12h.01M4 16.5h.01"
          stroke={tone}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (href === "/accounts") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d="M4.5 8.5h15M6.5 6h11a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 17.5 18h-11A1.5 1.5 0 0 1 5 16.5v-9A1.5 1.5 0 0 1 6.5 6Z"
          stroke={tone}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M8 13h3" stroke={tone} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M7 5.5h10a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 17 18.5H7A1.5 1.5 0 0 1 5.5 17V7A1.5 1.5 0 0 1 7 5.5Z"
        stroke={tone}
        strokeWidth="2"
      />
      <path d="M8.5 9.5h7M8.5 12h7M8.5 14.5h4" stroke={tone} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SidebarNav({
  defaultPortfolioId,
}: Readonly<{
  defaultPortfolioId?: string;
}>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get("portfolio") ?? defaultPortfolioId;
  const visibleItems = NAV_ITEMS.filter((item) => item.href !== "/");

  return (
    <nav className="space-y-1.5">
      {visibleItems.map((item) => {
        const isActive = pathname === item.href;
        const isGlobalMenu = item.href === "/todos";
        const href = isGlobalMenu
          ? item.href
          : portfolioId
            ? `${item.href}?${new URLSearchParams({ portfolio: portfolioId }).toString()}`
            : item.href;

        return (
          <Link
            key={item.href}
            href={href}
            className={cx(
              "group flex items-start gap-3 rounded-[1.15rem] border px-3.5 py-3.5 transition",
              isActive
                ? isGlobalMenu
                  ? "border-[rgba(255,203,107,0.12)] bg-[rgba(255,203,107,0.12)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  : "border-[rgba(110,168,254,0.14)] bg-[rgba(110,168,254,0.12)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                : "border-transparent text-[#b3bfdc] hover:border-white/6 hover:bg-white/4 hover:text-white",
            )}
          >
            <span
              className={cx(
                "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                isActive
                  ? isGlobalMenu
                    ? "bg-[rgba(255,203,107,0.16)]"
                    : "bg-[rgba(110,168,254,0.16)]"
                  : isGlobalMenu
                    ? "bg-[rgba(255,203,107,0.08)]"
                  : "bg-transparent",
              )}
            >
              <NavIcon href={item.href} active={isActive} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className="mt-1 block truncate whitespace-nowrap text-[11px] leading-5 text-[#7f92b7] transition group-hover:text-[#a8bbdd]">
                {item.description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
