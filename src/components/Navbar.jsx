import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import AuthModal from "./AuthModal";

const LINKS = [
  { to: "/connect", label: "Connect" },
  { to: "/inform", label: "Inform" },
  { to: "/support", label: "Support" },
  { to: "/supply", label: "Supply" },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  function openAuth(mode) {
    setAuthMode(mode);
    setAuthOpen(true);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Shield className="text-gold" size={26} strokeWidth={2} />
          <span className="font-display text-lg font-bold tracking-tight text-bone">
            THE <span className="text-gold">VANGUARD</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive ? "text-gold" : "text-bone-dim hover:text-bone"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {currentUser ? (
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 transition hover:border-gold"
            >
              <Avatar name={currentUser.name} color={currentUser.avatar_color} size={28} />
              <span className="text-sm font-medium text-bone">{currentUser.name.split(" ")[0]}</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => openAuth("login")}
                className="rounded-md px-3 py-2 text-sm font-medium text-bone-dim hover:text-bone"
              >
                Log in
              </button>
              <button
                onClick={() => openAuth("signup")}
                className="rounded-md bg-gold px-4 py-2 text-sm font-bold text-ink transition hover:bg-gold-soft"
              >
                Request Membership
              </button>
            </>
          )}
        </div>

        <button
          className="rounded-md p-2 text-bone lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-ink px-4 pb-4 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-panel text-gold" : "text-bone-dim"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
            {currentUser ? (
              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-bone"
              >
                <Avatar name={currentUser.name} color={currentUser.avatar_color} size={26} />
                My profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuth("login")}
                  className="rounded-md border border-line px-3 py-2.5 text-sm font-medium text-bone"
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuth("signup")}
                  className="rounded-md bg-gold px-3 py-2.5 text-sm font-bold text-ink"
                >
                  Request Membership
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </header>
  );
}
