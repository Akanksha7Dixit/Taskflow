import { useEffect, useState } from "react";

const USERS = ["A", "B", "C", "D"];

export function useCollaboration(tasks: any[]) {
  const [activity, setActivity] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: Record<string, string[]> = {};

      tasks.forEach((task) => {
        const count = Math.floor(Math.random() * 2); // 0–1 users

        const users = Array.from({ length: count }, () => {
          return USERS[Math.floor(Math.random() * USERS.length)];
        });

        if (users.length > 0) {
          newActivity[task.id] = users;
        }
      });

      setActivity(newActivity);
    }, 3000);

    return () => clearInterval(interval);
  }, [tasks]);

  return activity;
}