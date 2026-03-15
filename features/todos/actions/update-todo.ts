"use server";

import { redirect } from "next/navigation";

import { todoUpdateSchema } from "@/features/todos/schemas/todo";
import { updateTodo } from "@/features/todos/services/todo-service";
import { logger } from "@/lib/logger";

function buildTodoRedirectPath(formData: FormData, status: string) {
  const month = formData.get("redirectMonth");
  const date = formData.get("redirectDate");
  const params = new URLSearchParams({ status });
  const todoId = formData.get("redirectTodo");

  if (typeof month === "string" && month.length > 0) {
    params.set("month", month);
  }

  if (typeof date === "string" && date.length > 0) {
    params.set("date", date);
  }

  if (typeof todoId === "string" && todoId.length > 0) {
    params.set("todo", todoId);
  }

  return `/todos?${params.toString()}`;
}

export async function updateTodoAction(formData: FormData) {
  const parsed = todoUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    notes: formData.get("notes"),
    completed: formData.get("completed"),
  });

  if (!parsed.success) {
    logger.warn("todo.update.validation_failed", parsed.error.flatten());
    redirect(buildTodoRedirectPath(formData, "todo-invalid"));
  }

  await updateTodo(parsed.data);
  redirect(buildTodoRedirectPath(formData, "todo-updated"));
}
