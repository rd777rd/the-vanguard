import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";

// Fetches a list resource from the Django API on mount, exposes `create`
// (POST, prepends the new item) and `updateLocal` (optimistic patch after an
// action endpoint like /like/ or /rsvp/ returns), plus loading/error state.
export function useApiCollection(path) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(() => {
    setLoading(true);
    setError("");
    return api
      .get(path)
      .then((data) => setItems(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [path]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function create(body) {
    const created = await api.post(path, body);
    setItems((prev) => [created, ...prev]);
    return created;
  }

  function updateLocal(id, patch) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  return { items, loading, error, create, updateLocal, refresh, setItems };
}
