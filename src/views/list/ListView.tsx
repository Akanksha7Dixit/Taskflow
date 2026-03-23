import { useTaskStore } from "../../store/useTaskStore";
import { useState } from "react";
import type { Status } from "../../types/task";

const ROW_HEIGHT = 70;
const BUFFER = 5;

type SortField = "title" | "priority" | "dueDate";
type SortOrder = "asc" | "desc";

const priorityOrder = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const statusOptions: Status[] = ["todo", "inprogress", "inreview", "done"];
const priorityOptions = ["low", "medium", "high", "critical"];
const assigneeOptions = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank"];

export default function ListView() {
  const tasks = useTaskStore((s: any) => s.tasks);
  const setTasks = useTaskStore((s: any) => s.setTasks);

  const [scrollTop, setScrollTop] = useState(0);

  // 🔥 SORT
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // 🔥 FILTERS (MULTI-SELECT)
  const [statusFilter, setStatusFilter] = useState<Status[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [assigneeFilter, setAssigneeFilter] = useState<string[]>([]);

  const toggleFilter = (value: string, filter: string[], setFilter: any) => {
    if (filter.includes(value)) {
      setFilter(filter.filter((v) => v !== value));
    } else {
      setFilter([...filter, value]);
    }
  };

  // 🔥 APPLY FILTERS
  const filteredTasks = tasks.filter((task: any) => {
    const statusMatch =
      statusFilter.length === 0 || statusFilter.includes(task.status);

    const priorityMatch =
      priorityFilter.length === 0 ||
      priorityFilter.includes(task.priority);

    const assigneeMatch =
      assigneeFilter.length === 0 ||
      assigneeFilter.includes(task.assignee);

    return statusMatch && priorityMatch && assigneeMatch;
  });

  // 🔥 SORT
  const sortedTasks = [...filteredTasks].sort((a: any, b: any) => {
    let result = 0;

    if (sortField === "title") {
      result = a.title.localeCompare(b.title);
    }

    if (sortField === "priority") {
      result = priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    if (sortField === "dueDate") {
      result =
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime();
    }

    return sortOrder === "asc" ? result : -result;
  });

  // 🔥 VIRTUAL SCROLL
  const visibleStartIndex = Math.floor(scrollTop / ROW_HEIGHT);
  const visibleCount = Math.ceil(600 / ROW_HEIGHT);

  const startIndex = Math.max(0, visibleStartIndex - BUFFER);
  const endIndex = Math.min(
    sortedTasks.length,
    visibleStartIndex + visibleCount + BUFFER
  );

  const visibleTasks = sortedTasks.slice(startIndex, endIndex);

  const offsetY = startIndex * ROW_HEIGHT;
  const totalHeight = sortedTasks.length * ROW_HEIGHT;

  // 🔥 STATUS UPDATE
  const updateStatus = (taskId: string, newStatus: Status) => {
    const updatedTasks = tasks.map((task: any) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  // 🔁 SORT HANDLER
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">

      {/* 🔷 FILTER BAR */}
      <div className="p-4 bg-white border-b flex flex-wrap gap-4">

        {/* STATUS */}
        <div>
          <p className="text-xs font-semibold mb-1">Status</p>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() =>
                  toggleFilter(s, statusFilter, setStatusFilter)
                }
                className={`px-2 py-1 rounded text-xs ${
                  statusFilter.includes(s)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* PRIORITY */}
        <div>
          <p className="text-xs font-semibold mb-1">Priority</p>
          <div className="flex gap-2 flex-wrap">
            {priorityOptions.map((p) => (
              <button
                key={p}
                onClick={() =>
                  toggleFilter(p, priorityFilter, setPriorityFilter)
                }
                className={`px-2 py-1 rounded text-xs ${
                  priorityFilter.includes(p)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ASSIGNEE */}
        <div>
          <p className="text-xs font-semibold mb-1">Assignee</p>
          <div className="flex gap-2 flex-wrap">
            {assigneeOptions.map((a) => (
              <button
                key={a}
                onClick={() =>
                  toggleFilter(a, assigneeFilter, setAssigneeFilter)
                }
                className={`px-2 py-1 rounded text-xs ${
                  assigneeFilter.includes(a)
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 🔷 HEADER */}
      <div className="px-4 py-2 bg-gray-200 font-semibold grid grid-cols-5 cursor-pointer">
        <div onClick={() => handleSort("title")}>
          Title {getSortIcon("title")}
        </div>
        <div onClick={() => handleSort("priority")}>
          Priority {getSortIcon("priority")}
        </div>
        <div onClick={() => handleSort("dueDate")}>
          Due Date {getSortIcon("dueDate")}
        </div>
        <div>Assignee</div>
        <div>Status</div>
      </div>

      {/* 🔷 SCROLL */}
      <div
        className="flex-1 overflow-auto px-4"
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>

            {visibleTasks.map((task: any) => (
              <div
                key={task.id}
                className="grid grid-cols-5 items-center bg-white mb-3 p-4 rounded-xl shadow-sm"
              >
                <div>{task.title}</div>
                <div className="capitalize">{task.priority}</div>
                <div>{new Date(task.dueDate).toDateString()}</div>
                <div>{task.assignee}</div>
                <div>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateStatus(task.id, e.target.value as Status)
                    }
                  >
                    {statusOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

    </div>
  );
}