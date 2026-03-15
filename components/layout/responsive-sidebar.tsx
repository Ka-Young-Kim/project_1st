"use client";

import { useEffect, useRef, useState } from "react";

type ResponsiveSidebarProps = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

const LARGE_SCREEN_WIDTH = 1024;
const STICKY_OFFSET = 24;
const STICKY_VERTICAL_GAP = STICKY_OFFSET * 2;

export function ResponsiveSidebar({
  children,
  className,
}: ResponsiveSidebarProps) {
  const sidebarRef = useRef<HTMLElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const sidebar = sidebarRef.current;

      if (!sidebar || window.innerWidth < LARGE_SCREEN_WIDTH) {
        setIsSticky(false);
        return;
      }

      const availableHeight = window.innerHeight - STICKY_VERTICAL_GAP;
      const contentHeight = sidebar.scrollHeight;

      setIsSticky(contentHeight <= availableHeight);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className={className}
      style={
        isSticky
          ? {
              position: "sticky",
              top: `${STICKY_OFFSET}px`,
              maxHeight: `calc(100dvh - ${STICKY_VERTICAL_GAP}px)`,
              overflowY: "auto",
            }
          : undefined
      }
    >
      {children}
    </aside>
  );
}
