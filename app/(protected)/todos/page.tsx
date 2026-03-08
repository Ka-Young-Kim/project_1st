import { Banner } from "@/components/ui/banner";
import { TodoForm } from "@/features/todos/components/todo-form";
import { TodoList } from "@/features/todos/components/todo-list";
import { getTodos } from "@/features/todos/queries/get-todos";
import { getStatusMessage } from "@/lib/constants";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function TodosPage(props: { searchParams?: SearchParams }) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusParam = Array.isArray(searchParams.status)
    ? searchParams.status[0]
    : searchParams.status;
  const banner = getStatusMessage(statusParam);
  const todos = await getTodos();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="status-badge bg-white/80 text-[#b76a17]">TODO Ledger</p>
        <h1 className="text-3xl font-bold tracking-tight">할 일 관리</h1>
        <p className="text-sm text-[var(--muted)]">
          마감일과 우선순위를 함께 관리해 오늘 해야 할 일을 분리합니다.
        </p>
      </div>

      {banner ? <Banner tone={banner.tone}>{banner.message}</Banner> : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <TodoForm />
        <TodoList todos={todos} />
      </div>
    </div>
  );
}
