// import { useTaskStore } from "../../store/useTaskStore";
// import { useFilters } from "../../hooks/useFilters";
// import { useCollaboration } from "../../hooks/useCollaboration";

// type Status = "todo" | "inprogress" | "inreview" | "done";

// const columns: Status[] = ["todo", "inprogress", "inreview", "done"];

// export default function KanbanView() {
//   const tasks = useTaskStore((s: any) => s.tasks);
//   const updateTaskStatus = useTaskStore((s: any) => s.updateTaskStatus);

//   const filters = useFilters();
//   const activity = useCollaboration(tasks);

//   // ✅ FILTER LOGIC
//   const filteredTasks = tasks.filter((t: any) => {
//     if (filters.status.length && !filters.status.includes(t.status)) return false;
//     if (filters.priority.length && !filters.priority.includes(t.priority)) return false;
//     if (filters.assignee.length && !filters.assignee.includes(t.assignee)) return false;

//     if (filters.from && new Date(t.dueDate) < new Date(filters.from)) return false;
//     if (filters.to && new Date(t.dueDate) > new Date(filters.to)) return false;

//     return true;
//   });

//   // ✅ DRAG
//   const onDragStart = (e: React.DragEvent, id: number) => {
//     e.dataTransfer.setData("taskId", String(id));
//   };

//   // ✅ DROP
//   const onDrop = (e: React.DragEvent, status: Status) => {
//     const id = Number(e.dataTransfer.getData("taskId"));
//     updateTaskStatus(id, status);
//   };

//   const onDragOver = (e: React.DragEvent) => e.preventDefault();

//   // 🎨 PRIORITY COLOR
//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "low":
//         return "border-green-400";
//       case "medium":
//         return "border-yellow-400";
//       case "high":
//         return "border-orange-500";
//       case "critical":
//         return "border-red-500";
//       default:
//         return "border-gray-300";
//     }
//   };

//   return (
//     <div className="flex gap-4 overflow-x-auto p-4">
//       {columns.map((col) => {
//         const colTasks = filteredTasks.filter((t: any) => t.status === col);

//         return (
//           <div
//             key={col}
//             className="min-w-[280px] bg-gray-100 rounded-xl p-3 flex flex-col"
//             onDrop={(e) => onDrop(e, col)}
//             onDragOver={onDragOver}
//           >
//             {/* HEADER */}
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="font-semibold capitalize">{col}</h2>
//               <span className="text-sm text-gray-500">
//                 {colTasks.length}
//               </span>
//             </div>

//             {/* TASKS */}
//             <div className="flex flex-col gap-3">
//               {colTasks.map((task: any) => {
//                 const viewers = activity[task.id] || [];

//                 return (
//                   <div
//                     key={task.id}
//                     draggable
//                     onDragStart={(e) => onDragStart(e, task.id)}
//                     className={`bg-white rounded-xl p-3 shadow-sm border-l-4 cursor-grab active:cursor-grabbing 
//                     hover:shadow-md transition ${getPriorityColor(task.priority)}`}
//                   >
//                     {/* TITLE */}
//                     <div className="font-medium">{task.title}</div>

//                     {/* ASSIGNEE */}
//                     <div className="text-sm text-gray-500">
//                       {task.assignee}
//                     </div>

//                     {/* DATE */}
//                     <div className="text-xs text-gray-400 mt-1">
//                       {new Date(task.dueDate).toDateString()}
//                     </div>

//                     {/* 👇 PREMIUM AVATARS */}
//                     <div className="flex items-center mt-3">
//                       {viewers.length === 0 ? (
//                         <span className="text-xs text-gray-400">—</span>
//                       ) : (
//                         <div className="flex -space-x-2">
//                           {viewers.slice(0, 3).map((u: string, i: number) => (
//                             <div
//                               key={i}
//                               className="w-7 h-7 flex items-center justify-center rounded-full 
//                               bg-purple-500 text-white text-xs border-2 border-white"
//                             >
//                               {u[0]}
//                             </div>
//                           ))}

//                           {/* +MORE */}
//                           {viewers.length > 3 && (
//                             <div className="w-7 h-7 flex items-center justify-center rounded-full 
//                             bg-gray-400 text-white text-xs border-2 border-white">
//                               +{viewers.length - 3}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

import { useTaskStore } from "../../store/useTaskStore";
import { useFilters } from "../../hooks/useFilters";
import { useCollaboration } from "../../hooks/useCollaboration";

type Status = "todo" | "inprogress" | "inreview" | "done";

const columns: Status[] = ["todo", "inprogress", "inreview", "done"];

export default function KanbanView() {
  const tasks = useTaskStore((s: any) => s.tasks);
  const updateTaskStatus = useTaskStore((s: any) => s.updateTaskStatus);

  const filters = useFilters();
  const activity = useCollaboration(tasks);

  // ✅ FILTER
  const filteredTasks = tasks.filter((t: any) => {
    if (filters.status.length && !filters.status.includes(t.status)) return false;
    if (filters.priority.length && !filters.priority.includes(t.priority)) return false;
    if (filters.assignee.length && !filters.assignee.includes(t.assignee)) return false;

    if (filters.from && new Date(t.dueDate) < new Date(filters.from)) return false;
    if (filters.to && new Date(t.dueDate) > new Date(filters.to)) return false;

    return true;
  });

  // ✅ DRAG START (FIXED → string id)
  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("taskId", id);
  };

  // ✅ DROP (FIXED → NO Number conversion)
  const onDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();

    const id = e.dataTransfer.getData("taskId"); // ✅ string
    if (!id) return;

    updateTaskStatus(id, status); // ✅ WORKS NOW
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // ✅ REQUIRED
  };

  // 🎨 PRIORITY COLOR
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "border-green-400";
      case "medium":
        return "border-yellow-400";
      case "high":
        return "border-orange-500";
      case "critical":
        return "border-red-500";
      default:
        return "border-gray-300";
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {columns.map((col) => {
        const colTasks = filteredTasks.filter((t: any) => t.status === col);

        return (
          <div
            key={col}
            className="min-w-[280px] bg-gray-100 rounded-xl p-3 flex flex-col"
            onDrop={(e) => onDrop(e, col)}
            onDragOver={onDragOver}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold capitalize">{col}</h2>
              <span className="text-sm text-gray-500">
                {colTasks.length}
              </span>
            </div>

            {/* TASKS */}
            <div className="flex flex-col gap-3">
              {colTasks.map((task: any) => {
                const viewers = activity[task.id] || [];

                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, task.id)} // ✅ string
                    className={`bg-white rounded-xl p-3 shadow-sm border-l-4 
                    cursor-grab active:cursor-grabbing select-none
                    hover:shadow-md transition ${getPriorityColor(task.priority)}`}
                  >
                    {/* TITLE */}
                    <div className="font-medium">{task.title}</div>

                    {/* ASSIGNEE */}
                    <div className="text-sm text-gray-500">
                      {task.assignee}
                    </div>

                    {/* DATE */}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(task.dueDate).toDateString()}
                    </div>

                    {/* AVATARS */}
                    <div className="flex items-center mt-3">
                      {viewers.length === 0 ? (
                        <span className="text-xs text-gray-400">—</span>
                      ) : (
                        <div className="flex -space-x-2">
                          {viewers.slice(0, 3).map((u: string, i: number) => (
                            <div
                              key={i}
                              className="w-7 h-7 flex items-center justify-center rounded-full 
                              bg-purple-500 text-white text-xs border-2 border-white"
                            >
                              {u[0]}
                            </div>
                          ))}

                          {viewers.length > 3 && (
                            <div className="w-7 h-7 flex items-center justify-center rounded-full 
                            bg-gray-400 text-white text-xs border-2 border-white">
                              +{viewers.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}