import { create } from "zustand";
import type { Task } from "../types/task";

type Store = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
};

export const useTaskStore = create<Store>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
}));