import { Banner } from "@/components/ui/banner";
import { JournalForm } from "@/features/journal/components/journal-form";
import { JournalList } from "@/features/journal/components/journal-list";
import { getJournalEntries } from "@/features/journal/queries/get-journal-entries";
import { getStatusMessage } from "@/lib/constants";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function JournalPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusParam = Array.isArray(searchParams.status)
    ? searchParams.status[0]
    : searchParams.status;
  const banner = getStatusMessage(statusParam);
  const entries = await getJournalEntries();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="status-badge bg-white/80 text-[var(--accent-strong)]">
          Investment Journal
        </p>
        <h1 className="text-3xl font-bold tracking-tight">투자일지</h1>
        <p className="text-sm text-[var(--muted)]">
          매수·매도 거래와 투자 이유, 회고를 같은 기록으로 남깁니다.
        </p>
      </div>

      {banner ? <Banner tone={banner.tone}>{banner.message}</Banner> : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <JournalForm />
        <JournalList entries={entries} />
      </div>
    </div>
  );
}
