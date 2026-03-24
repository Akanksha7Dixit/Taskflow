import { useFilters } from "../hooks/useFilters";

const statuses = ["todo", "inprogress", "inreview", "done"];
const priorities = ["low", "medium", "high", "critical"];
const assignees = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank"];

export default function FilterBar() {
  const {
    status,
    priority,
    assignee,
    from,
    to,
    toggleFilter,
    setDate,
  } = useFilters();

  const isActive = (type: string, value: string) => {
    if (type === "status") return status.includes(value);
    if (type === "priority") return priority.includes(value);
    if (type === "assignee") return assignee.includes(value);
    return false;
  };

  const base =
    "px-3 py-1 rounded-full text-xs border transition cursor-pointer";

  const active =
    "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow";

  const inactive =
    "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm px-4 py-3 mb-3 border">

      {/* 🔹 COMPACT GRID */}
      <div className="grid md:grid-cols-4 gap-4 items-center">

        {/* STATUS */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <div className="flex flex-wrap gap-1">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => toggleFilter("status", s)}
                className={`${base} ${
                  isActive("status", s) ? active : inactive
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* PRIORITY */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Priority</p>
          <div className="flex flex-wrap gap-1">
            {priorities.map((p) => (
              <button
                key={p}
                onClick={() => toggleFilter("priority", p)}
                className={`${base} ${
                  isActive("priority", p) ? active : inactive
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ASSIGNEE */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Assignee</p>
          <div className="flex flex-wrap gap-1">
            {assignees.map((a) => (
              <button
                key={a}
                onClick={() => toggleFilter("assignee", a)}
                className={`${base} ${
                  isActive("assignee", a) ? active : inactive
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* DATE */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Due Date</p>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={from || ""}
              onChange={(e) => setDate("from", e.target.value)}
              className="border rounded-md px-2 py-1 text-xs"
            />
            <span className="text-gray-400 text-xs">—</span>
            <input
              type="date"
              value={to || ""}
              onChange={(e) => setDate("to", e.target.value)}
              className="border rounded-md px-2 py-1 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}