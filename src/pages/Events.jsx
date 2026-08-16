import { useState } from "react";
import { Calendar, Clock, MapPin, Check } from "lucide-react";
import { useApiCollection } from "../hooks/useApiCollection";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import SectionHeading from "../components/SectionHeading";
import AuthModal from "../components/AuthModal";

function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function Events() {
  const { currentUser } = useAuth();
  const { items: events, loading, updateLocal } = useApiCollection("/events/");
  const [authOpen, setAuthOpen] = useState(false);
  const [rsvping, setRsvping] = useState(null);

  async function toggleRsvp(id) {
    if (!currentUser) return setAuthOpen(true);
    setRsvping(id);
    try {
      const { going, going_count } = await api.post(`/events/${id}/rsvp/`, {});
      updateLocal(id, { going, going_count });
    } catch {
      // best-effort — RSVP state just won't flip if this fails
    } finally {
      setRsvping(null);
    }
  }

  return (
    <div>
      <section className="border-b border-line bg-noise">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Community calendar"
            title="Events"
            description="Clinics, workshops, and gatherings hosted by members building power across the community."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading && (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-bone-dim">
            Loading the calendar...
          </p>
        )}
        <div className="space-y-4">
          {events.map((e) => (
            <div
              key={e.id}
              className="card-hover flex flex-col gap-4 rounded-2xl border border-line bg-panel p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex gap-4">
                <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-line bg-ink-soft py-2">
                  <span className="font-display text-lg font-bold text-gold">
                    {new Date(e.date + "T00:00:00").getDate()}
                  </span>
                  <span className="text-[10px] uppercase text-bone-dim">
                    {new Date(e.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-bone">{e.title}</h3>
                  <p className="mt-1 text-sm text-bone-dim">{e.description}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-bone-dim">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(e.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {e.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {e.city}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-bone-dim">
                    Hosted by {e.host ? e.host.name : e.host_name} · {e.going_count}{" "}
                    {e.going_count === 1 ? "member" : "members"} going
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleRsvp(e.id)}
                disabled={rsvping === e.id}
                className={`flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-bold transition disabled:opacity-60 ${
                  e.going ? "bg-emerald/15 text-emerald border border-emerald/40" : "bg-gold text-ink hover:bg-gold-soft"
                }`}
              >
                {e.going ? (
                  <>
                    <Check size={16} /> Going
                  </>
                ) : (
                  "RSVP"
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
