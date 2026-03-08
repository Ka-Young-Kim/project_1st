"use server";

import { redirect } from "next/navigation";

import { todoUpdateSchema } from "@/features/todos/schemas/todo";
import { updateTodo } from "@/features/todos/services/todo-service";
import { logger } from "@/lib/logger";

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
    redirect("/todos?status=todo-invalid");
  }

  await updateTodo(parsed.data);
  redirect("/todos?status=todo-updated");
}
