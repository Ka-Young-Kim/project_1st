"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { NAV_ITEMS } from "@/lib/constants";
import { cx } from "@/lib/utils";

function NavIcon({ href, active }: Readonly<{ href: string; active: boolean }>) {
  const tone = active ? "#6ea8fe" : "#93a4c7";

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

export function SidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get("portfolio");

  return (
    <nav className="space-y-1.5">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={
              portfolioId
                ? `${item.href}?${new URLSearchParams({ portfolio: portfolioId }).toString()}`
                : item.href
            }
            className={cx(
              "group flex items-center gap-3 rounded-[1rem] px-3 py-3 transition",
              isActive
                ? "bg-[rgba(110,168,254,0.12)] text-white"
                : "text-[#b3bfdc] hover:bg-white/4 hover:text-white",
            )}
          >
            <span
              className={cx(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                isActive
                  ? "bg-[rgba(110,168,254,0.16)]"
                  : "bg-transparent",
              )}
            >
              <NavIcon href={item.href} active={isActive} />
            </span>
            <span className="text-sm font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
