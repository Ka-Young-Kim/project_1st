"use server";

import { redirect } from "next/navigation";

import { toggleTodo } from "@/features/todos/services/todo-service";
import { logger } from "@/lib/logger";

export async function toggleTodoAction(formData: FormData) {
  const id = formData.get("id");
  const completed = formData.get("completed");

  if (typeof id !== "string" || typeof completed !== "string") {
    logger.warn("todo.toggle.validation_failed");
    redirect("/todos?status=todo-invalid");
  }

  await toggleTodo(id, completed === "true");
  redirect("/todos?status=todo-updated");
}
