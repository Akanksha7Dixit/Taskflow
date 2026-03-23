// export default function App() {
//   return <div>App Started</div>;
// }

import { useEffect } from "react";
import { generateTasks } from "./data/generateTasks";
import { useTaskStore } from "./store/useTaskStore";

export default function App() {
  const setTasks = useTaskStore((s) => s.setTasks);

  useEffect(() => {
    const tasks = generateTasks(500);
    setTasks(tasks);
  }, []);

  return <div>Tasks Loaded</div>;
}