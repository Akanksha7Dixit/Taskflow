import { create } from "zustand";
import { generateTasks } from "../data/generateTasks";
import type { Task, Status } from "../types/task";

type Store = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (id: string, status: Status) => void; // ✅ FIXED
};

export const useTaskStore = create<Store>((set) => ({
  tasks: generateTasks(200),

  setTasks: (tasks) => set({ tasks }),

  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),
}));