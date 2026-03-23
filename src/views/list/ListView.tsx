import { useTaskStore } from "../../store/useTaskStore";
import { useState } from "react";

export default function ListView() {
  const tasks = useTaskStore((s) => s.tasks);

  const [sortField, setSortField] = useState<"title" | "priority" | "dueDate">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let valA: any = a[sortField];
    let valB: any = b[sortField];

    if (sortField === "dueDate") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-4 h-screen overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("title")}
            >
              Title
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("priority")}
            >
              Priority
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("dueDate")}
            >
              Due Date
            </th>
            <th className="p-2">Assignee</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {sortedTasks.map((task) => (
            <tr key={task.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{task.title}</td>
              <td className="p-2 capitalize">{task.priority}</td>
              <td className="p-2">
                {new Date(task.dueDate).toDateString()}
              </td>
              <td className="p-2">{task.assignee}</td>
              <td className="p-2 capitalize">{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}