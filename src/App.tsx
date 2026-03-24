import { useState, useEffect } from "react";
import { generateTasks } from "./data/generateTasks";
import { useTaskStore } from "./store/useTaskStore";

import KanbanView from "./views/kanban/KanbanView";
import ListView from "./views/list/ListView";
import TimelineView from "./views/timeline/TimelineView";

export default function App() {
  const setTasks = useTaskStore((s) => s.setTasks);
  const [view, setView] = useState<"kanban" | "list" | "timeline">("kanban");

  useEffect(() => {
    const tasks = generateTasks(500);
    setTasks(tasks);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col">

      {/* NAVBAR */}
      <div className="flex gap-4 p-4 border-b bg-white">
        <button onClick={() => setView("kanban")}>Kanban</button>
        <button onClick={() => setView("list")}>List</button>
        <button onClick={() => setView("timeline")}>Timeline</button>
      </div>

      {/* VIEW */}
      <div className="flex-1 overflow-hidden">
        {view === "kanban" && <KanbanView />}
        {view === "list" && <ListView />}
        {view === "timeline" && <TimelineView />}
      </div>
    </div>
  );
}