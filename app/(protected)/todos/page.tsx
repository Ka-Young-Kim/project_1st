import { DesktopSplitLayout } from "@/components/layout/desktop-split-layout";
import { StatusToast } from "@/components/ui/status-toast";
import { TodoCalendar } from "@/features/todos/components/todo-calendar";
import { TodoInspector } from "@/features/todos/components/todo-inspector";
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
  const selectedTodoId = Array.isArray(searchParams.todo)
    ? searchParams.todo[0]
    : searchParams.todo;
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
  const selectedTodo =
    visibleTodos.find((todo) => todo.id === selectedTodoId) ??
    monthlyTodos.find((todo) => todo.id === selectedTodoId) ??
    todos.find((todo) => todo.id === selectedTodoId);
  const completedTodoCount = monthlyTodos.filter((todo) => todo.completed).length;
  const remainingTodoCount = monthlyTodos.length - completedTodoCount;

  return (
    <div className="space-y-6">
      {banner ? <StatusToast tone={banner.tone}>{banner.message}</StatusToast> : null}

      <div className="space-y-5">
        <TodoStats
          summary={{
            monthLabel,
            registeredTodoCount: monthlyTodos.length,
            completedTodoCount,
            remainingTodoCount,
          }}
        />
        <DesktopSplitLayout
          primary={
            <div className="desktop-secondary-grid">
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
                selectedTodoId={selectedTodo?.id}
                viewAllHref={`/todos?${new URLSearchParams({ month: currentMonth }).toString()}`}
              />
            </div>
          }
          secondary={
            <TodoInspector
              todo={selectedTodo}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
            />
          }
        />
      </div>
    </div>
  );
}
