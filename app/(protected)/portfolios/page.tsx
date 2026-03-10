import { StatusToast } from "@/components/ui/status-toast";
import { PortfolioForm } from "@/features/portfolios/components/portfolio-form";
import { PortfolioList } from "@/features/portfolios/components/portfolio-list";
import { getPortfolios } from "@/features/portfolios/queries/get-portfolios";
import { getStatusMessage } from "@/lib/constants";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PortfoliosPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusParam = Array.isArray(searchParams.status)
    ? searchParams.status[0]
    : searchParams.status;
  const banner = getStatusMessage(statusParam);
  const portfolios = await getPortfolios();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="status-badge bg-white/80 text-[var(--accent-strong)]">
          Portfolios
        </p>
        <h1 className="text-3xl font-bold tracking-tight">포트폴리오 관리</h1>
        <p className="text-sm text-[var(--muted)]">
          포트폴리오별로 관리되는 항목과 공통 항목을 구분해 관리합니다.
        </p>
      </div>
      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}
      <div className="grid gap-6">
        <PortfolioList portfolios={portfolios} />
        <PortfolioForm />
      </div>
    </div>
  );
}
