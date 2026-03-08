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
    redirect("/todos?status=todo-invalid");
  }

  await createTodo(parsed.data);
  redirect("/todos?status=todo-created");
}
