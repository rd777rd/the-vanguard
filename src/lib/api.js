// Thin fetch wrapper around the Django REST API. Handles the base URL,
// JSON encoding/decoding, the auth token header, and turning DRF's various
// error shapes into a single readable string.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const TOKEN_KEY = "vanguard:token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function extractErrorMessage(payload) {
  if (!payload) return "Something went wrong. Try again.";
  if (typeof payload === "string") return payload;
  if (payload.detail) return payload.detail;
  // DRF validation errors come back as { field: ["message", ...] }
  const firstKey = Object.keys(payload)[0];
  if (firstKey) {
    const value = payload[firstKey];
    const message = Array.isArray(value) ? value[0] : value;
    return typeof message === "string" ? message : "Something went wrong. Try again.";
  }
  return "Something went wrong. Try again.";
}

async function request(path, { method = "GET", body, auth = true, _retried = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  const sentAuth = auth && !!token;
  if (sentAuth) headers.Authorization = `Token ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach The Vanguard's servers. Is the backend running?");
  }

  if (res.status === 204) return null;

  // A token that's been revoked (or belongs to a deleted member) makes DRF
  // reject the request outright, even on endpoints anyone can normally read.
  // Clear it and retry once unauthenticated so a stale token in localStorage
  // doesn't lock a visitor out of public content — it just quietly logs them out.
  if (res.status === 401 && sentAuth && !_retried) {
    setToken(null);
    window.dispatchEvent(new Event("vanguard:unauthorized"));
    return request(path, { method, body, auth, _retried: true });
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new Error(extractErrorMessage(payload));
  }
  return payload;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
