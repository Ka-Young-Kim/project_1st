"use server";

import { redirect } from "next/navigation";

import { deleteTodo } from "@/features/todos/services/todo-service";
import { logger } from "@/lib/logger";

export async function deleteTodoAction(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    logger.warn("todo.delete.validation_failed");
    redirect("/todos?status=todo-invalid");
  }

  await deleteTodo(id);
  redirect("/todos?status=todo-deleted");
}
