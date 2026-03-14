import Link from "next/link";

import { StatusToast } from "@/components/ui/status-toast";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { PortfolioForm } from "@/features/portfolios/components/portfolio-form";
import { PortfolioList } from "@/features/portfolios/components/portfolio-list";
import { resolvePortfolioId } from "@/features/portfolios/queries/get-portfolios";
import { getStatusMessage } from "@/lib/constants";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PortfolioHubPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusParam = Array.isArray(searchParams.status)
    ? searchParams.status[0]
    : searchParams.status;
  const portfolioId = Array.isArray(searchParams.portfolio)
    ? searchParams.portfolio[0]
    : searchParams.portfolio;
  const banner = getStatusMessage(statusParam);
  const { portfolios, activePortfolio } = await resolvePortfolioId(portfolioId);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Portfolio Hub"
        title="포트폴리오 허브"
        description="포트폴리오 목록 확인, 신규 생성, 이름 수정, 삭제를 이 페이지에서 관리하고 구성 페이지로 자연스럽게 이어지게 정리합니다."
      />

      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}

      {activePortfolio ? (
        <Card
          surface="glass"
          className="flex flex-col gap-4 bg-[linear-gradient(135deg,rgba(9,22,44,.96),rgba(13,29,53,.98))] text-white shadow-[0_18px_50px_rgba(0,0,0,.28)] md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
              Selected Portfolio
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {activePortfolio.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#8fb0ec]">
              구성 설정은 메뉴의 포트폴리오 구성 페이지에서 진행합니다.
            </p>
          </div>
          <Link
            href={`/portfolios?${new URLSearchParams({ portfolio: activePortfolio.id }).toString()}`}
            className="inline-flex items-center justify-center rounded-[1rem] border border-[rgba(110,168,254,0.32)] bg-[rgba(110,168,254,0.14)] px-5 py-3 text-sm font-semibold text-[#dce7ff] transition hover:bg-[rgba(110,168,254,0.22)]"
          >
            현재 포트폴리오 구성 열기
          </Link>
        </Card>
      ) : null}

      <div className="overflow-x-auto pb-1">
        <div className="grid min-w-[1080px] grid-cols-[1.15fr_0.85fr] gap-6">
          <PortfolioList
            portfolios={portfolios}
            selectedPortfolioId={activePortfolio?.id}
          />
          <PortfolioForm />
        </div>
      </div>
    </div>
  );
}
