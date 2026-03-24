import { useRef, useState, useEffect } from "react";
import { useTaskStore } from "../../store/useTaskStore";
import { useFilters } from "../../hooks/useFilters";
import { useCollaboration } from "../../hooks/useCollaboration";

const ROW_HEIGHT = 70; // px
const BUFFER = 5;

export default function ListView() {
  const tasks = useTaskStore((s: any) => s.tasks);
  const updateTaskStatus = useTaskStore((s: any) => s.updateTaskStatus);

  const { priority, assignee, from, to } = useFilters();
  const activity = useCollaboration(tasks);

  const containerRef = useRef<HTMLDivElement>(null);

  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(600);

  // ✅ FILTER
  const filteredTasks = tasks.filter((t: any) => {
    if (priority.length && !priority.includes(t.priority)) return false;
    if (assignee.length && !assignee.includes(t.assignee)) return false;
    if (from && new Date(t.dueDate) < new Date(from)) return false;
    if (to && new Date(t.dueDate) > new Date(to)) return false;
    return true;
  });

  // ✅ SCROLL HANDLER
  const onScroll = () => {
    if (!containerRef.current) return;
    setScrollTop(containerRef.current.scrollTop);
  };

  // ✅ SET HEIGHT
  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.clientHeight);
    }
  }, []);

  // ✅ CALCULATIONS
  const total = filteredTasks.length;
  const visibleCount = Math.ceil(height / ROW_HEIGHT);

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - BUFFER
  );

  const endIndex = Math.min(
    total,
    startIndex + visibleCount + BUFFER * 2
  );

  const visibleTasks = filteredTasks.slice(startIndex, endIndex);

  const offsetY = startIndex * ROW_HEIGHT;
  const totalHeight = total * ROW_HEIGHT;

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="grid grid-cols-6 font-semibold border-b pb-2 mb-2">
        <div>Title</div>
        <div>Priority</div>
        <div>Due Date</div>
        <div>Assignee</div>
        <div>Status</div>
        <div>Activity</div>
      </div>

      {/* SCROLL CONTAINER */}
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="h-[600px] overflow-auto border rounded"
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
            }}
          >
            {visibleTasks.map((task: any) => {
              const due = new Date(task.dueDate);
              const today = new Date();

              let dueText = due.toDateString();
              let dueClass = "";

              const diff =
                (today.getTime() - due.getTime()) /
                (1000 * 60 * 60 * 24);

              if (diff > 0) {
                dueText = `Overdue ${Math.floor(diff)}d`;
                dueClass = "text-red-500";
              } else if (
                due.toDateString() === today.toDateString()
              ) {
                dueText = "Due Today";
                dueClass = "text-orange-500";
              }

              return (
                <div
                  key={task.id}
                  className="grid grid-cols-6 items-center border-b px-2"
                  style={{ height: ROW_HEIGHT }}
                >
                  <div>{task.title}</div>
                  <div>{task.priority}</div>
                  <div className={dueClass}>{dueText}</div>
                  <div>{task.assignee}</div>

                  {/* STATUS CHANGE */}
                  <div>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskStatus(task.id, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="todo">todo</option>
                      <option value="inprogress">inprogress</option>
                      <option value="inreview">inreview</option>
                      <option value="done">done</option>
                    </select>
                  </div>

                  {/* ACTIVITY */}
                  <div>
                    {activity[task.id] ? (
                      <div className="w-8 h-8 bg-purple-500 text-white flex items-center justify-center rounded-full text-xs">
                        {activity[task.id]}
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredTasks.length === 0 && (
        <div className="text-center mt-6 text-gray-500">
          No tasks found
        </div>
      )}
    </div>
  );
}