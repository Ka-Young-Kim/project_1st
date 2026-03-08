import { prisma } from "@/lib/prisma";
import { getDayRangeFromDateInputInSeoul } from "@/lib/utils";

export async function getTodos(selectedDate?: string) {
  const dueDateFilter = selectedDate
    ? getDayRangeFromDateInputInSeoul(selectedDate)
    : null;

  return prisma.todo.findMany({
    where: dueDateFilter
      ? {
          dueDate: {
            gte: dueDateFilter.start,
            lt: dueDateFilter.end,
          },
        }
      : undefined,
    orderBy: [{ completed: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
  });
}
