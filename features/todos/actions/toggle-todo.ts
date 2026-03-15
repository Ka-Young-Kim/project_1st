"use server";

import { redirect } from "next/navigation";

import { toggleTodo } from "@/features/todos/services/todo-service";
import { logger } from "@/lib/logger";

export async function toggleTodoAction(formData: FormData) {
  const id = formData.get("id");
  const completed = formData.get("completed");

  if (typeof id !== "string" || typeof completed !== "string") {
    logger.warn("todo.toggle.validation_failed");
    redirect(buildTodoRedirectPath(formData, "todo-invalid"));
  }

  await toggleTodo(id, completed === "true");
  redirect(buildTodoRedirectPath(formData, "todo-updated"));
}

function buildTodoRedirectPath(formData: FormData, status: string) {
  const params = new URLSearchParams({ status });
  const month = getString(formData, "redirectMonth");
  const date = getString(formData, "redirectDate");
  const todoId = getString(formData, "redirectTodo");

  if (month) {
    params.set("month", month);
  }

  if (date) {
    params.set("date", date);
  }

  if (todoId) {
    params.set("todo", todoId);
  }

  return `/todos?${params.toString()}`;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
