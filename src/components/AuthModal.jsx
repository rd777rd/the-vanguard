import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { TAGS } from "../data/seed";
import CityStateField from "./CityStateField";

export default function AuthModal({ open, onClose, initialMode = "signup" }) {
  const { signup, login } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldKey, setFieldKey] = useState(0);

  if (!open) return null;

  function toggleTag(tag) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function reset() {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCity("");
    setTags([]);
    setError("");
    setFieldKey((k) => k + 1);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function switchMode(next) {
    setMode(next);
    setPassword("");
    setConfirmPassword("");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!name.trim() || !email.trim() || !password) {
        setError("Name, email, and password are required.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords don't match.");
        return;
      }
      setSubmitting(true);
      const res = await signup({ name: name.trim(), email: email.trim(), password, city, tags });
      setSubmitting(false);
      if (!res.ok) return setError(res.error);
      handleClose();
    } else {
      if (!email.trim() || !password) {
        setError("Enter your email and password.");
        return;
      }
      setSubmitting(true);
      const res = await login({ email: email.trim(), password });
      setSubmitting(false);
      if (!res.ok) return setError(res.error);
      handleClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-line bg-panel p-6 sm:p-8 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-bone-dim hover:bg-panel-raised hover:text-bone"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <p className="font-display text-xs uppercase tracking-[0.25em] text-gold">The Vanguard</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-bone">
          {mode === "signup" ? "Request your membership" : "Welcome back"}
        </h2>
        <p className="mt-1 text-sm text-bone-dim">
          {mode === "signup"
            ? "One membership, four ways to build power together."
            : "Log in with your email and password."}
        </p>

        <div className="mt-5 flex rounded-lg border border-line p-1">
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition ${
              mode === "signup" ? "bg-gold text-ink" : "text-bone-dim hover:text-bone"
            }`}
          >
            Sign up
          </button>
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition ${
              mode === "login" ? "bg-gold text-ink" : "text-bone-dim hover:text-bone"
            }`}
          >
            Log in
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-bone-dim">
                Full name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Amara Johnson"
                className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/50 outline-none focus:border-gold"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-bone-dim">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/50 outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-bone-dim">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/50 outline-none focus:border-gold"
            />
          </div>

          {mode === "signup" && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-bone-dim">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Type it again"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/50 outline-none focus:border-gold"
                />
              </div>

              <CityStateField key={fieldKey} value={city} onChange={setCity} />

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-bone-dim">
                  Communities you're part of (optional)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TAGS.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border px-2.5 py-1 text-xs transition ${
                        tags.includes(tag)
                          ? "border-gold bg-gold/15 text-gold"
                          : "border-line text-bone-dim hover:border-bone-dim"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-crimson">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gold py-2.5 text-sm font-bold text-ink transition hover:bg-gold-soft disabled:opacity-60"
          >
            {submitting
              ? mode === "signup"
                ? "Confirming..."
                : "Logging in..."
              : mode === "signup"
                ? "Confirm my membership"
                : "Log in"}
          </button>
          <p className="text-center text-xs text-bone-dim/70">
            Your password is private — never shared with other members.
          </p>
        </form>
      </div>
    </div>
  );
}
