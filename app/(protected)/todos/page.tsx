import { StatusToast } from "@/components/ui/status-toast";
import { TodoCalendar } from "@/features/todos/components/todo-calendar";
import { TodoForm } from "@/features/todos/components/todo-form";
import { TodoList } from "@/features/todos/components/todo-list";
import { TodoStats } from "@/features/todos/components/todo-stats";
import { getTodos } from "@/features/todos/queries/get-todos";
import { getStatusMessage } from "@/lib/constants";
import { formatDateInput } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function TodosPage(props: { searchParams?: SearchParams }) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusParam = Array.isArray(searchParams.status)
    ? searchParams.status[0]
    : searchParams.status;
  const selectedMonth = Array.isArray(searchParams.month)
    ? searchParams.month[0]
    : searchParams.month;
  const banner = getStatusMessage(statusParam);
  const todos = await getTodos();
  const currentMonth = selectedMonth ?? formatDateInput(new Date()).slice(0, 7);
  const monthLabel = currentMonth.replace("-", " / ");
  const monthlyTodos = todos.filter(
    (todo) => todo.dueDate && formatDateInput(todo.dueDate).slice(0, 7) === currentMonth,
  );
  const completedTodoCount = monthlyTodos.filter((todo) => todo.completed).length;
  const remainingTodoCount = monthlyTodos.length - completedTodoCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="status-badge bg-white/80 text-[#b76a17]">TODO Ledger</p>
        <h1 className="text-3xl font-bold tracking-tight">할 일 관리</h1>
        <p className="text-sm text-[var(--muted)]">
          마감일과 우선순위를 함께 관리해 오늘 해야 할 일을 분리합니다.
        </p>
      </div>

      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}

      <div className="grid gap-6">
        <TodoStats
          summary={{
            monthLabel,
            registeredTodoCount: monthlyTodos.length,
            completedTodoCount,
            remainingTodoCount,
          }}
        />
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <TodoCalendar
            activeMonth={selectedMonth}
            todos={todos.map((todo) => ({
              id: todo.id,
              title: todo.title,
              dueDate: todo.dueDate ? formatDateInput(todo.dueDate) : null,
              completed: todo.completed,
            }))}
          />
          <TodoList todos={todos} />
        </div>
        <TodoForm />
      </div>
    </div>
  );
}
