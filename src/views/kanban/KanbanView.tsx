import { useTaskStore } from "../../store/useTaskStore";
import { useState } from "react";
import type { Status } from "../../types/task";

const columns: { key: Status; title: string }[] = [
  { key: "todo", title: "To Do" },
  { key: "inprogress", title: "In Progress" },
  { key: "inreview", title: "In Review" },
  { key: "done", title: "Done" },
];

export default function KanbanView() {
  const tasks = useTaskStore((s) => s.tasks);
  const setTasks = useTaskStore((s) => s.setTasks);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<Status | null>(null);

  const handleDrop = (status: Status) => {
    if (!draggedTaskId) return;

    const updatedTasks = tasks.map((task) =>
      task.id === draggedTaskId ? { ...task, status } : task
    );

    setTasks(updatedTasks);
    setDraggedTaskId(null);
    setActiveColumn(null);
  };

  return (
    <div className="flex flex-row gap-4 p-4 w-screen h-screen overflow-x-auto">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.key);

        return (
          <div
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              setActiveColumn(col.key);
            }}
            onDragLeave={() => setActiveColumn(null)}
            onDrop={() => handleDrop(col.key)}
            className={`w-[300px] flex-shrink-0 p-3 rounded-lg shadow transition ${
              activeColumn === col.key
                ? "bg-blue-100"
                : "bg-gray-100"
            }`}
          >
            <h2 className="font-bold mb-3 text-center">
              {col.title} ({columnTasks.length})
            </h2>

            <div className="flex flex-col gap-2 max-h-[75vh] overflow-y-auto">
              {columnTasks.map((task) => {
                const dueDate = new Date(task.dueDate);
                const today = new Date();
                const isOverdue = dueDate < today;

                const isDragging = draggedTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedTaskId(task.id);

                      // 👇 Custom drag image (hidden)
                      const img = new Image();
                      img.src =
                        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIwIiBoZWlnaHQ9IjAiPjwvc3ZnPg==";
                      e.dataTransfer.setDragImage(img, 0, 0);
                    }}
                    onDragEnd={() => {
                      setDraggedTaskId(null);
                      setActiveColumn(null);
                    }}
                    className={`p-3 rounded shadow transition cursor-grab ${
                      isDragging
                        ? "bg-white opacity-50 scale-95 shadow-lg"
                        : "bg-white hover:shadow-md"
                    }`}
                  >
                    <p className="font-medium">{task.title}</p>

                    <p
                      className={`text-xs mt-1 ${
                        isOverdue
                          ? "text-red-500 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {isOverdue
                        ? "Overdue"
                        : dueDate.toDateString()}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                        {task.assignee.charAt(0)}
                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded font-semibold capitalize ${
                          task.priority === "critical"
                            ? "bg-red-100 text-red-600"
                            : task.priority === "high"
                            ? "bg-orange-100 text-orange-600"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {task.priority}
                      </span>
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