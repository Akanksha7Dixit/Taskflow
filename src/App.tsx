import { useEffect } from "react";
import { generateTasks } from "./data/generateTasks";
import { useTaskStore } from "./store/useTaskStore";
import KanbanView from "./views/kanban/KanbanView";

export default function App() {
  const setTasks = useTaskStore((s) => s.setTasks);

  useEffect(() => {
    const tasks = generateTasks(500);
    setTasks(tasks);
  }, []);

  return (
  <div className="w-screen h-screen">
    <KanbanView />
  </div>
);
}