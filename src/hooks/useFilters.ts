import { useSearchParams } from "react-router-dom";

function clean(values: string[]) {
  return values.filter((v) => v && v.trim() !== "");
}

export function useFilters() {
  const [params, setParams] = useSearchParams();

  const status = clean(params.getAll("status"));
  const priority = clean(params.getAll("priority"));
  const assignee = clean(params.getAll("assignee"));

  const from = params.get("from") || null;
  const to = params.get("to") || null;

  function toggleFilter(key: string, value: string) {
    const current = clean(params.getAll(key));

    const newValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    params.delete(key);
    newValues.forEach((v) => params.append(key, v));

    setParams(params);
  }

  function setDate(key: "from" | "to", value: string) {
    if (!value) params.delete(key);
    else params.set(key, value);

    setParams(params);
  }

  function clearFilters() {
    setParams({});
  }

  return {
    status,
    priority,
    assignee,
    from,
    to,
    toggleFilter,
    setDate,
    clearFilters,
  };
}