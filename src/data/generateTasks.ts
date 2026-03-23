import type { Task, Status, Priority } from "../types/task";
import { users } from "./users";

const statuses: Status[] = ["todo", "inprogress", "inreview", "done"];
const priorities: Priority[] = ["low", "medium", "high", "critical"];

function randomDate() {
  const now = new Date();
  const offset = Math.floor(Math.random() * 20) - 10;
  now.setDate(now.getDate() + offset);
  return now.toISOString();
}

export function generateTasks(count: number): Task[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `task-${i}`,
    title: `Task ${i}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    assignee: users[Math.floor(Math.random() * users.length)],
    startDate: Math.random() > 0.2 ? randomDate() : undefined,
    dueDate: randomDate(),
  }));
}

console.log("working");