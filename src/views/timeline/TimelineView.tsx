import { useTaskStore } from "../../store/useTaskStore";
import { useState, useEffect } from "react";

const DAY_WIDTH = 40;
const ROW_HEIGHT = 56;

function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => i + 1);
}

function getOffset(dateStr: string, startOfMonth: Date) {
  const d = new Date(dateStr);
  return Math.floor(
    (d.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export default function TimelineView() {
  const tasks = useTaskStore((s: any) => s.tasks);
  const setTasks = useTaskStore((s: any) => s.setTasks);

  const [dragTaskId, setDragTaskId] = useState<string | null>(null);
  const [resizeTaskId, setResizeTaskId] = useState<string | null>(null);

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const days = getDaysInMonth(today);

  const totalWidth = days.length * DAY_WIDTH;

  // 🔥 DROP
  const handleDrop = (dayIndex: number) => {
    if (!dragTaskId) return;

    const updated = tasks.map((t: any) => {
      if (t.id !== dragTaskId) return t;

      const newStart = new Date(startOfMonth);
      newStart.setDate(dayIndex + 1);

      const oldStart = new Date(t.startDate || t.dueDate);
      const oldEnd = new Date(t.dueDate);

      const duration =
        (oldEnd.getTime() - oldStart.getTime()) /
        (1000 * 60 * 60 * 24);

      const newEnd = new Date(newStart);
      newEnd.setDate(newStart.getDate() + duration);

      return {
        ...t,
        startDate: newStart.toISOString(),
        dueDate: newEnd.toISOString(),
      };
    });

    setTasks(updated);
    setDragTaskId(null);
  };

  // 🔥 RESIZE
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!resizeTaskId) return;

      const updated = tasks.map((t: any) => {
        if (t.id !== resizeTaskId) return t;

        const x = e.clientX - 160;
        const dayIndex = Math.round(x / DAY_WIDTH);

        const newEnd = new Date(startOfMonth);
        newEnd.setDate(dayIndex + 1);

        return {
          ...t,
          dueDate: newEnd.toISOString(),
        };
      });

      setTasks(updated);
    };

    const stop = () => setResizeTaskId(null);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stop);
    };
  }, [resizeTaskId, tasks]);

  return (
    <div className="h-full overflow-auto bg-gray-50">

      {/* HEADER */}
      <div className="flex sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="w-40 p-3 font-semibold border-r">Task</div>

        <div className="flex">
          {days.map((d) => (
            <div
              key={d}
              className="w-10 text-xs text-center border-l text-gray-500"
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="relative">

        {tasks.map((task: any) => {
          const start = task.startDate || task.dueDate;

          // 🔥 CLAMP INSIDE MONTH
          let startOffset = getOffset(start, startOfMonth);
          let endOffset = getOffset(task.dueDate, startOfMonth);

          startOffset = Math.max(0, startOffset);
          endOffset = Math.min(days.length - 1, endOffset);

          // ❗ if completely outside → skip render
          if (endOffset < 0 || startOffset > days.length - 1) return null;

          const width = Math.max(1, endOffset - startOffset + 1);

          const color =
            task.priority === "critical"
              ? "bg-red-500"
              : task.priority === "high"
              ? "bg-orange-400"
              : task.priority === "medium"
              ? "bg-yellow-400"
              : "bg-green-400";

          return (
            <div
              key={task.id}
              className="flex border-b items-center"
              style={{ height: ROW_HEIGHT }}
            >
              <div className="w-40 px-3 text-sm font-medium truncate">
                {task.title}
              </div>

              <div
                className="relative flex-1 h-full overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const dayIndex = Math.floor(x / DAY_WIDTH);
                  handleDrop(dayIndex);
                }}
              >
                {/* GRID */}
                <div className="absolute inset-0 flex">
                  {days.map((d) => (
                    <div
                      key={d}
                      className="w-10 border-l border-gray-200"
                    />
                  ))}
                </div>

                {/* BAR */}
                <div
                  draggable
                  onDragStart={() => setDragTaskId(task.id)}
                  onDragEnd={() => setDragTaskId(null)}
                  className={`absolute h-9 rounded-xl px-3 text-xs text-white flex items-center shadow-lg cursor-grab ${color}`}
                  style={{
                    left: `${startOffset * DAY_WIDTH}px`,
                    width: `${width * DAY_WIDTH}px`,
                    maxWidth: `${totalWidth}px`, // 🔥 prevent overflow
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {task.assignee}

                  {/* RESIZE HANDLE */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setResizeTaskId(task.id);
                    }}
                    className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/40 rounded-r-xl"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* TODAY LINE */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-blue-500"
          style={{
            left:
              160 +
              Math.min(
                days.length - 1,
                Math.max(0, getOffset(today.toISOString(), startOfMonth))
              ) *
                DAY_WIDTH,
          }}
        />
      </div>
    </div>
  );
}