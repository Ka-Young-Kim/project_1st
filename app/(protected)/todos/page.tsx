import { StatusToast } from "@/components/ui/status-toast";
import { PageHeader } from "@/components/ui/page-header";
import { TodoCalendar } from "@/features/todos/components/todo-calendar";
import { TodoList } from "@/features/todos/components/todo-list";
import { TodoStats } from "@/features/todos/components/todo-stats";
import { getTodos } from "@/features/todos/queries/get-todos";
import { getStatusMessage } from "@/lib/constants";
import { formatDateInput, getTodayDateInputInSeoul } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function TodosPage(props: { searchParams?: SearchParams }) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusParam = Array.isArray(searchParams.status)
    ? searchParams.status[0]
    : searchParams.status;
  const selectedMonth = Array.isArray(searchParams.month)
    ? searchParams.month[0]
    : searchParams.month;
  const selectedDateParam = Array.isArray(searchParams.date)
    ? searchParams.date[0]
    : searchParams.date;
  const banner = getStatusMessage(statusParam);
  const todos = await getTodos();
  const currentMonth = selectedMonth ?? formatDateInput(new Date()).slice(0, 7);
  const today = getTodayDateInputInSeoul();
  const shouldDefaultToToday = !selectedMonth && !selectedDateParam;
  const selectedDate =
    selectedDateParam && selectedDateParam.startsWith(currentMonth)
      ? selectedDateParam
      : shouldDefaultToToday && today.startsWith(currentMonth)
        ? today
        : undefined;
  const monthLabel = currentMonth.replace("-", " / ");
  const monthlyTodos = todos.filter(
    (todo) => todo.dueDate && formatDateInput(todo.dueDate).slice(0, 7) === currentMonth,
  );
  const visibleTodos = selectedDate
    ? monthlyTodos.filter(
        (todo) => todo.dueDate && formatDateInput(todo.dueDate) === selectedDate,
      )
    : monthlyTodos;
  const completedTodoCount = monthlyTodos.filter((todo) => todo.completed).length;
  const remainingTodoCount = monthlyTodos.length - completedTodoCount;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="TODO Ledger"
        title="할 일 관리"
        description="마감일과 우선순위를 함께 보면서 오늘 처리할 일, 미뤄도 되는 일, 정리가 필요한 백로그를 빠르게 구분합니다."
      />

      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}

      <div className="grid gap-5">
        <TodoStats
          summary={{
            monthLabel,
            registeredTodoCount: monthlyTodos.length,
            completedTodoCount,
            remainingTodoCount,
          }}
        />
        <div className="grid gap-5 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <TodoCalendar
            activeMonth={selectedMonth}
            selectedDate={selectedDate}
            todos={todos.map((todo) => ({
              id: todo.id,
              title: todo.title,
              dueDate: todo.dueDate ? formatDateInput(todo.dueDate) : null,
              completed: todo.completed,
            }))}
          />
          <TodoList
            todos={visibleTodos}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            viewAllHref={`/todos?${new URLSearchParams({ month: currentMonth }).toString()}`}
          />
        </div>
      </div>
    </div>
  );
}
