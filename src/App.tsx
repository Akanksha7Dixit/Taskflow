import { useEffect, useState } from "react";
import { generateTasks } from "./data/generateTasks";
import { useTaskStore } from "./store/useTaskStore";

import KanbanView from "./views/kanban/KanbanView";
import ListView from "./views/list/ListView";

export default function App() {
  const setTasks = useTaskStore((s: any) => s.setTasks);

  const [view, setView] = useState<"kanban" | "list">("kanban");

  useEffect(() => {
    const tasks = generateTasks(500);
    setTasks(tasks);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      
      {/* 🔷 Header */}
      <div className="p-3 flex gap-3 border-b bg-white shrink-0">
        <button
          onClick={() => setView("kanban")}
          className={`px-4 py-2 rounded ${
            view === "kanban"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Kanban
        </button>

        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded ${
            view === "list"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          List
        </button>
      </div>

      {/* 🔷 Main Content */}
      <div className="flex-1 overflow-hidden">
        {view === "kanban" && <KanbanView />}
        {view === "list" && <ListView />}
      </div>

    </div>
  );
}