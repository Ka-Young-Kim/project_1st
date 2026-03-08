import { revalidatePath } from "next/cache";

import { TodoInput, TodoUpdateInput } from "@/features/todos/schemas/todo";
import { prisma } from "@/lib/prisma";

function toDateOrNull(value?: string) {
  return value ? new Date(`${value}T00:00:00+09:00`) : null;
}

export async function createTodo(input: TodoInput) {
  await prisma.todo.create({
    data: {
      title: input.title,
      priority: input.priority,
      dueDate: toDateOrNull(input.dueDate),
      notes: input.notes || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/todos");
}

export async function updateTodo(input: TodoUpdateInput) {
  await prisma.todo.update({
    where: { id: input.id },
    data: {
      title: input.title,
      priority: input.priority,
      dueDate: toDateOrNull(input.dueDate),
      notes: input.notes || null,
      completed: input.completed === "true",
    },
  });

  revalidatePath("/");
  revalidatePath("/todos");
}

export async function toggleTodo(id: string, completed: boolean) {
  await prisma.todo.update({
    where: { id },
    data: { completed },
  });

  revalidatePath("/");
  revalidatePath("/todos");
}

export async function deleteTodo(id: string) {
  await prisma.todo.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/todos");
}
