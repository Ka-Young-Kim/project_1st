export type TodoListItem = {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  dueDate: Date | null;
  completed: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};
