import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On load, if a token is already stashed in this browser, fetch the
  // member it belongs to so refreshing the page doesn't log anyone out.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setInitializing(false);
      return;
    }
    api
      .get("/auth/me/")
      .then(setCurrentUser)
      .catch(() => setToken(null))
      .finally(() => setInitializing(false));
  }, []);

  // A revoked/stale token gets cleared by the API layer on any 401 — mirror
  // that here so the UI drops back to "logged out" instead of quietly
  // holding on to a currentUser whose token no longer works.
  useEffect(() => {
    function handleUnauthorized() {
      setCurrentUser(null);
    }
    window.addEventListener("vanguard:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("vanguard:unauthorized", handleUnauthorized);
  }, []);

  async function signup({ name, email, password, city, tags }) {
    try {
      const { user, token } = await api.post("/auth/signup/", { name, email, password, city, tags });
      setToken(token);
      setCurrentUser(user);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  async function login({ email, password }) {
    try {
      const { user, token } = await api.post("/auth/login/", { email, password });
      setToken(token);
      setCurrentUser(user);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  function logout() {
    api.post("/auth/logout/", {}).catch(() => {});
    setToken(null);
    setCurrentUser(null);
  }

  async function updateCurrentUser(patch) {
    if (!currentUser) return;
    const prev = currentUser;
    setCurrentUser((u) => ({ ...u, ...patch })); // optimistic
    try {
      const updated = await api.patch("/auth/me/", patch);
      setCurrentUser(updated);
    } catch {
      setCurrentUser(prev); // roll back on failure
    }
  }

  const value = { currentUser, initializing, signup, login, logout, updateCurrentUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
