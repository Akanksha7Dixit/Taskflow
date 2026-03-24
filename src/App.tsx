// import { useEffect, useState } from "react";
// import KanbanView from "./views/kanban/KanbanView";
// import ListView from "./views/list/ListView";
// import TimelineView from "./views/timeline/TimelineView";
// import FilterBar from "./components/FilterBar";
// import { useTaskStore } from "./store/useTaskStore";
// import { generateTasks } from "./data/generateTasks";

// export default function App() {
//   const [view, setView] = useState("kanban");

//   const setTasks = useTaskStore((s: any) => s.setTasks);
//   const tasks = useTaskStore((s: any) => s.tasks);

//   // ✅ INIT TASKS (THIS WAS MISSING)
//   useEffect(() => {
//     if (!tasks || tasks.length === 0) {
//       const generated = generateTasks(200);
//       setTasks(generated);
//     }
//   }, []);

//   return (
//     <div className="h-screen flex flex-col">

//       {/* NAV */}
//       <div className="flex gap-4 p-3 border-b">
//         {["kanban", "list", "timeline"].map((v) => (
//           <button
//             key={v}
//             onClick={() => setView(v)}
//             className={view === v ? "font-bold" : ""}
//           >
//             {v}
//           </button>
//         ))}
//       </div>

//       {/* FILTER BAR */}
//       <FilterBar />

//       {/* VIEW */}
//       <div className="flex-1 overflow-auto">
//         {view === "kanban" && <KanbanView />}
//         {view === "list" && <ListView />}
//         {view === "timeline" && <TimelineView />}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import KanbanView from "./views/kanban/KanbanView";
import ListView from "./views/list/ListView";
import TimelineView from "./views/timeline/TimelineView";
import FilterBar from "./components/FilterBar";
import { useTaskStore } from "./store/useTaskStore";
import { generateTasks } from "./data/generateTasks";

export default function App() {
  const [view, setView] = useState("kanban");

  const setTasks = useTaskStore((s: any) => s.setTasks);
  const tasks = useTaskStore((s: any) => s.tasks);

  // ✅ INIT TASKS
  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      const generated = generateTasks(200);
      setTasks(generated);
    }
  }, []);

  const tabs = ["kanban", "list", "timeline"];

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      {/* 🔥 PREMIUM NAVBAR */}
      <div className="bg-white/80 backdrop-blur-md border-b shadow-sm px-4 py-2 flex gap-2 sticky top-0 z-10">
        {tabs.map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              view === v
                ? "text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* FILTER BAR */}
      <FilterBar />

      {/* VIEW */}
      <div className="flex-1 overflow-auto">
        {view === "kanban" && <KanbanView />}
        {view === "list" && <ListView />}
        {view === "timeline" && <TimelineView />}
      </div>
    </div>
  );
}