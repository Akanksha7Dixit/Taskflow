import { useTaskStore } from "../../store/useTaskStore";

const DAY_WIDTH = 40;
const ROW_HEIGHT = 56;
const LEFT_WIDTH = 160;

function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => i + 1);
}

function getOffset(dateStr: string, startOfMonth: Date) {
  const d = new Date(dateStr);
  const diff =
    (d.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24);
  return Math.floor(diff);
}

export default function TimelineView() {
  const tasks = useTaskStore((s: any) => s.tasks);

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const days = getDaysInMonth(today);

  const totalWidth = days.length * DAY_WIDTH;

  return (
    <div className="h-full flex flex-col bg-gray-50">

      {/* 🔥 MAIN SCROLL CONTAINER */}
      <div className="flex-1 overflow-auto">

        {/* 🔷 INNER WIDTH CONTAINER (IMPORTANT) */}
        <div style={{ width: LEFT_WIDTH + totalWidth }}>

          {/* 🔷 HEADER */}
          <div className="flex sticky top-0 z-20 bg-white border-b shadow-sm">
            <div
              className="p-3 font-semibold border-r bg-gray-100"
              style={{ width: LEFT_WIDTH }}
            >
              Task
            </div>

            <div className="flex">
              {days.map((d) => (
                <div
                  key={d}
                  style={{ width: DAY_WIDTH }}
                  className="text-xs text-center border-l text-gray-500"
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* 🔷 ROWS */}
          <div className="relative">

            {tasks.map((task: any) => {
              const start = task.startDate || task.dueDate;

              let startOffset = getOffset(start, startOfMonth);
              let endOffset = getOffset(task.dueDate, startOfMonth);

              // ✅ HARD CLAMP
              startOffset = Math.max(0, Math.min(startOffset, days.length - 1));
              endOffset = Math.max(startOffset, Math.min(endOffset, days.length - 1));

              const width = Math.max(1, endOffset - startOffset + 1);

              const colors: any = {
                critical: "bg-red-500",
                high: "bg-orange-400",
                medium: "bg-yellow-400",
                low: "bg-green-500",
              };

              return (
                <div
                  key={task.id}
                  className="flex border-b items-center hover:bg-gray-100"
                  style={{ height: ROW_HEIGHT }}
                >
                  {/* LEFT */}
                  <div
                    className="px-3 text-sm truncate font-medium text-gray-700"
                    style={{ width: LEFT_WIDTH }}
                  >
                    {task.title}
                  </div>

                  {/* GRID + BAR */}
                  <div className="relative flex-1">

                    {/* GRID */}
                    <div className="absolute inset-0 flex">
                      {days.map((d) => (
                        <div
                          key={d}
                          style={{ width: DAY_WIDTH }}
                          className="border-l border-gray-200"
                        />
                      ))}
                    </div>

                    {/* BAR */}
                    <div
                      className={`absolute h-8 rounded-lg px-3 text-xs text-white flex items-center shadow-md ${
                        colors[task.priority]
                      }`}
                      style={{
                        left: startOffset * DAY_WIDTH,
                        width: width * DAY_WIDTH,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      {task.assignee}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 🔵 TODAY LINE */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-blue-500 z-10"
              style={{
                left:
                  LEFT_WIDTH +
                  Math.max(
                    0,
                    Math.min(
                      getOffset(today.toISOString(), startOfMonth),
                      days.length - 1
                    )
                  ) *
                    DAY_WIDTH,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}