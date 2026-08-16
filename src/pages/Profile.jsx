import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, MapPin, Mail, Calendar as CalendarIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { TAGS } from "../data/seed";
import { api } from "../lib/api";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";

export default function Profile() {
  const { currentUser, logout, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    api
      .get("/events/")
      .then(setEvents)
      .catch(() => {});
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-bone">You're not logged in</h1>
        <p className="mt-2 text-sm text-bone-dim">Join or log in to see your Vanguard profile.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-ink hover:bg-gold-soft"
        >
          Back to home
        </button>
      </div>
    );
  }

  const savedEvents = events.filter((e) => (currentUser.saved_events || []).includes(e.id));

  function toggleTag(tag) {
    const tags = currentUser.tags || [];
    const next = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
    updateCurrentUser({ tags: next });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-6 rounded-2xl border border-line bg-panel p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={currentUser.name} color={currentUser.avatar_color} size={64} />
          <div>
            <h1 className="font-display text-2xl font-bold text-bone">{currentUser.name}</h1>
            <p className="text-sm text-bone-dim">{currentUser.handle}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-bone-dim">
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {currentUser.city}
              </span>
              <span className="flex items-center gap-1">
                <Mail size={12} /> {currentUser.email}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex items-center gap-1.5 rounded-lg border border-line px-4 py-2 text-sm font-medium text-bone-dim hover:border-crimson hover:text-crimson"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-panel p-6">
        <h2 className="font-display text-lg font-bold text-bone">Your communities</h2>
        <p className="mt-1 text-sm text-bone-dim">Tap to join or leave a community tag — this shapes what you see across the platform.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {TAGS.map((tag) => {
            const active = (currentUser.tags || []).includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  active ? "border-gold bg-gold/15 text-gold" : "border-line text-bone-dim hover:border-bone-dim"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-panel p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-bone">
          <CalendarIcon size={18} className="text-gold" /> Events you're going to
        </h2>
        {savedEvents.length === 0 ? (
          <p className="mt-3 text-sm text-bone-dim">
            You haven't RSVP'd to anything yet. Check out the{" "}
            <button onClick={() => navigate("/events")} className="text-gold hover:underline">
              events calendar
            </button>
            .
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {savedEvents.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-xl border border-line bg-ink-soft p-4">
                <div>
                  <p className="font-semibold text-bone">{e.title}</p>
                  <p className="text-xs text-bone-dim">
                    {e.date} &middot; {e.time} &middot; {e.city}
                  </p>
                </div>
                <Badge color="emerald">Going</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
