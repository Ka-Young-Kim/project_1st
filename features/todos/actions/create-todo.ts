"use server";

import { redirect } from "next/navigation";

import { todoInputSchema } from "@/features/todos/schemas/todo";
import { createTodo } from "@/features/todos/services/todo-service";
import { logger } from "@/lib/logger";

export async function createTodoAction(formData: FormData) {
  const parsed = todoInputSchema.safeParse({
    title: formData.get("title"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    logger.warn("todo.create.validation_failed", parsed.error.flatten());
    redirect(buildTodoRedirectPath(formData, "todo-invalid"));
  }

  const todo = await createTodo(parsed.data);
  redirect(buildTodoRedirectPath(formData, "todo-created", { todoId: todo.id }));
}

function buildTodoRedirectPath(
  formData: FormData,
  status: string,
  options?: { todoId?: string; includeSelectedTodo?: boolean },
) {
  const params = new URLSearchParams({ status });
  const month = getString(formData, "redirectMonth");
  const date = getString(formData, "redirectDate");
  const todoId = options?.todoId ?? getString(formData, "redirectTodo");
  const includeSelectedTodo = options?.includeSelectedTodo ?? true;

  if (month) {
    params.set("month", month);
  }

  if (date) {
    params.set("date", date);
  }

  if (includeSelectedTodo && todoId) {
    params.set("todo", todoId);
  }

  return `/todos?${params.toString()}`;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
