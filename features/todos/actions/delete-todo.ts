"use server";

import { redirect } from "next/navigation";

import { deleteTodo } from "@/features/todos/services/todo-service";
import { logger } from "@/lib/logger";

export async function deleteTodoAction(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    logger.warn("todo.delete.validation_failed");
    redirect(buildTodoRedirectPath(formData, "todo-invalid"));
  }

  await deleteTodo(id);
  redirect(buildTodoRedirectPath(formData, "todo-deleted"));
}

function buildTodoRedirectPath(formData: FormData, status: string) {
  const params = new URLSearchParams({ status });
  const month = getString(formData, "redirectMonth");
  const date = getString(formData, "redirectDate");

  if (month) {
    params.set("month", month);
  }

  if (date) {
    params.set("date", date);
  }

  return `/todos?${params.toString()}`;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
