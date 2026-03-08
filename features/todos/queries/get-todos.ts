import { prisma } from "@/lib/prisma";

export async function getTodos() {
  return prisma.todo.findMany({
    orderBy: [{ completed: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
  });
}
