import { StatusToast } from "@/components/ui/status-toast";
import { PageHeader } from "@/components/ui/page-header";
import { BuySellStatsDialog } from "@/features/journal/components/buy-sell-stats-dialog";
import { JournalCalendar } from "@/features/journal/components/journal-calendar";
import { JournalList } from "@/features/journal/components/journal-list";
import { getInvestmentItems } from "@/features/investment-items/queries/get-investment-items";
import { getPortfolioAccounts } from "@/features/portfolios/queries/get-portfolio-accounts";
import { resolvePortfolioId } from "@/features/portfolios/queries/get-portfolios";
import { getJournalEntries } from "@/features/journal/queries/get-journal-entries";
import { getStatusMessage } from "@/lib/constants";
import { formatDateInput, formatDisplayDate, formatWon } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function JournalPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusParam = Array.isArray(searchParams.status)
    ? searchParams.status[0]
    : searchParams.status;
  const selectedMonth = Array.isArray(searchParams.month)
    ? searchParams.month[0]
    : searchParams.month;
  const selectedDate = Array.isArray(searchParams.date)
    ? searchParams.date[0]
    : searchParams.date;
  const portfolioId = Array.isArray(searchParams.portfolio)
    ? searchParams.portfolio[0]
    : searchParams.portfolio;
  const banner = getStatusMessage(statusParam);
  const { activePortfolio } = await resolvePortfolioId(portfolioId);
  const [entries, itemOptions, accountOptions] = await Promise.all([
    getJournalEntries(activePortfolio?.id),
    getInvestmentItems({ activeOnly: true, portfolioId: activePortfolio?.id }),
    getPortfolioAccounts(activePortfolio?.id),
  ]);
  const currentMonth = selectedMonth ?? formatDateInput(new Date()).slice(0, 7);
  const visibleEntries = selectedDate
    ? entries.filter((entry) => formatDateInput(entry.tradeDate) === selectedDate)
    : entries;
  const selectedYear = Number(currentMonth.slice(0, 4));
  const monthlyEntries = entries.filter(
    (entry) => formatDateInput(entry.tradeDate).slice(0, 7) === currentMonth,
  );
  const buyCount = monthlyEntries.filter((entry) => entry.action === "buy").length;
  const sellCount = monthlyEntries.length - buyCount;
  const monthlyBuyAmount = monthlyEntries
    .filter((entry) => entry.action === "buy")
    .reduce((total, entry) => total + Number(entry.quantity) * Number(entry.price), 0);
  const monthlySellAmount = monthlyEntries
    .filter((entry) => entry.action === "sell")
    .reduce((total, entry) => total + Number(entry.quantity) * Number(entry.price), 0);
  const monthlyTurnover = monthlyEntries.reduce((total, entry) => {
    return total + Number(entry.quantity) * Number(entry.price);
  }, 0);
  const lastTradeDate = entries[0]?.tradeDate ?? null;
  const availableYears = Array.from(
    new Set([
      selectedYear,
      ...entries.map((entry) => Number(formatDateInput(entry.tradeDate).slice(0, 4))),
    ]),
  ).sort((left, right) => right - left);
  const seriesByYear = availableYears.map((year) => ({
    year,
    months: Array.from({ length: 12 }, (_, index) => {
      const key = `${year}-${String(index + 1).padStart(2, "0")}`;
      const bucket = entries.filter(
        (entry) => formatDateInput(entry.tradeDate).slice(0, 7) === key,
      );

      return {
        key,
        label: `${index + 1}월`,
        buy: bucket
          .filter((entry) => entry.action === "buy")
          .reduce(
            (total, entry) => total + Number(entry.quantity) * Number(entry.price),
            0,
          ),
        sell: bucket
          .filter((entry) => entry.action === "sell")
          .reduce(
            (total, entry) => total + Number(entry.quantity) * Number(entry.price),
            0,
          ),
      };
    }),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Investment Journal"
        title="투자일지"
        description={
          activePortfolio
            ? `${activePortfolio.name} 포트폴리오의 매수·매도 거래와 회고를 기록하고, 캘린더와 리스트로 흐름을 빠르게 복기합니다.`
            : "포트폴리오를 먼저 생성한 뒤 거래 기록과 회고를 연결하세요."
        }
      />

      <div className="grid gap-3 lg:grid-cols-3">
          <div className="glass-panel flex min-h-[7.75rem] flex-col rounded-[16px] p-3.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              이번 달 기록
            </p>
            <p className="mt-2 flex-1 text-[1.45rem] font-semibold tracking-tight">
              {monthlyEntries.length}
            </p>
            <p className="text-[13px] text-[var(--muted)]">
              {currentMonth.replace("-", ".")} 기준 거래 로그 수
            </p>
          </div>

          <BuySellStatsDialog
            buyCount={buyCount}
            sellCount={sellCount}
            monthlyBuyAmount={monthlyBuyAmount}
            monthlySellAmount={monthlySellAmount}
            initialYear={selectedYear}
            seriesByYear={seriesByYear}
          />

          <div className="glass-panel flex min-h-[7.75rem] flex-col rounded-[16px] p-3.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              최근 거래일
            </p>
            <p className="mt-2 flex-1 text-[1.45rem] font-semibold tracking-tight">
              {lastTradeDate ? formatDisplayDate(lastTradeDate) : "-"}
            </p>
            <p className="text-[13px] text-[var(--muted)]">
              월 누적 거래금액 {formatWon(String(monthlyTurnover))}
            </p>
          </div>
      </div>

      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}

      <div className="grid gap-5">
        <div className="grid gap-5 2xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
          <JournalCalendar
            activeMonth={selectedMonth}
            portfolioId={activePortfolio?.id}
            selectedDate={selectedDate}
            entries={entries.map((entry) => ({
              id: entry.id,
              tradeDate: formatDateInput(entry.tradeDate),
              symbol: entry.itemName ?? entry.symbol,
              action: entry.action,
              quantity: entry.quantity,
              price: entry.price,
            }))}
          />
          <JournalList
            entries={visibleEntries}
            items={itemOptions.map((item) => ({
              id: item.id,
              name: item.name,
              code: item.code,
              category: item.category,
            }))}
            accounts={accountOptions.map((account) => ({
              id: account.id,
              name: account.name,
              displayId: account.displayId,
            }))}
            portfolioId={activePortfolio?.id ?? ""}
            viewAllHref={`/journal?${new URLSearchParams(
              Object.fromEntries(
                Object.entries({
                  portfolio: activePortfolio?.id ?? "",
                  month: currentMonth,
                }).filter(([, value]) => value),
              ),
            ).toString()}`}
          />
        </div>
      </div>
    </div>
  );
}
