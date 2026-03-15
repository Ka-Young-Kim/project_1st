"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";
import { NAV_ITEMS } from "@/lib/constants";
import { cx } from "@/lib/utils";

export function DesktopPageHeader({
  brandName,
  activePortfolioName,
  className,
}: Readonly<{
  brandName: string;
  activePortfolioName?: string;
  className?: string;
}>) {
  const pathname = usePathname();
  const activeItem = useMemo(() => {
    return NAV_ITEMS.find((item) => item.href === pathname);
  }, [pathname]);
  const pageHeader = useMemo(() => {
    switch (pathname) {
      case "/":
        return {
          eyebrow: "Today",
          title: "오늘의 재테크",
          description: activePortfolioName
            ? `현재 포트폴리오 ${activePortfolioName} 기준으로 보유 종목, 거래 흐름, 오늘 처리할 할 일을 한 번에 확인합니다.`
            : "현재 포트폴리오 기준 보유 종목, 거래 흐름, 오늘 처리할 할 일을 한 번에 확인합니다.",
        };
      case "/portfolios":
        return {
          eyebrow: "Portfolio Setup",
          title: "포트폴리오 구성",
          description:
            "선택한 포트폴리오의 계좌, 자산군, 목표 비율, 리밸런싱, 스냅샷 흐름을 한 화면에서 관리합니다.",
        };
      case "/portfolios/snapshots":
        return {
          eyebrow: "Snapshot View",
          title: "스냅샷 관리",
          description:
            "선택한 포트폴리오의 누적 스냅샷을 시계열로 확인하고, 구성 페이지로 다시 돌아가 흐름을 이어갑니다.",
        };
      case "/portfolio-hub":
        return {
          eyebrow: "Portfolio Hub",
          title: "포트폴리오 허브",
          description:
            "포트폴리오 목록 확인, 신규 생성, 이름 수정, 삭제를 이 페이지에서 관리하고 구성 페이지로 자연스럽게 이어지게 정리합니다.",
        };
      case "/journal":
        return {
          eyebrow: "Investment Journal",
          title: "투자일지",
          description: activePortfolioName
            ? `${activePortfolioName} 포트폴리오의 매수·매도 거래와 회고를 기록하고, 캘린더와 리스트로 흐름을 빠르게 복기합니다.`
            : "포트폴리오를 먼저 생성한 뒤 거래 기록과 회고를 연결하세요.",
        };
      case "/items":
        return {
          eyebrow: "Investment Items",
          title: "투자 항목 관리",
          description: activePortfolioName
            ? `${activePortfolioName} 포트폴리오 기준으로 종목 정보를 정리하고, 거래 기록과 시세 조회에 사용할 기본 메타데이터를 관리합니다.`
            : "포트폴리오를 먼저 생성한 뒤 투자 항목을 등록하세요.",
        };
      case "/todos":
        return {
          eyebrow: "TODO Ledger",
          title: "할 일 관리",
          description:
            "마감일과 우선순위를 함께 보면서 오늘 처리할 일, 미뤄도 되는 일, 정리가 필요한 백로그를 빠르게 구분합니다.",
        };
      default:
        return {
          eyebrow: brandName.toUpperCase(),
          title: activeItem?.label ?? brandName,
          description: activeItem?.description ?? "데스크톱 작업 흐름",
        };
    }
  }, [activeItem?.description, activeItem?.label, activePortfolioName, brandName, pathname]);

  return <PageHeader {...pageHeader} className={cx("border-b-0 pb-0", className)} />;
}
