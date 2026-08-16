import { useState } from "react";
import { Plus, X, HandHeart, HandCoins, MapPin, ShieldCheck } from "lucide-react";
import { useApiCollection } from "../hooks/useApiCollection";
import { timeAgo } from "../lib/store";
import { useAuth } from "../context/AuthContext";
import SectionHeading from "../components/SectionHeading";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import AuthModal from "../components/AuthModal";
import CityStateField from "../components/CityStateField";

export default function Support() {
  const { currentUser } = useAuth();
  const { items, loading, create } = useApiCollection("/backing/");
  const [filter, setFilter] = useState("all");
  const [composerOpen, setComposerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [form, setForm] = useState({ type: "request", title: "", detail: "", city: "" });
  const [fieldKey, setFieldKey] = useState(0);
  const [posting, setPosting] = useState(false);
  const [formError, setFormError] = useState("");

  const filtered = items.filter((i) => filter === "all" || i.type === filter);

  function openComposer(type) {
    if (!currentUser) return setAuthOpen(true);
    setForm((f) => ({ ...f, type }));
    setComposerOpen(true);
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.detail.trim()) return;
    setPosting(true);
    setFormError("");
    try {
      await create({
        type: form.type,
        title: form.title.trim(),
        detail: form.detail.trim(),
        city: form.city || "Remote / Online",
      });
      setForm({ type: "request", title: "", detail: "", city: "" });
      setFieldKey((k) => k + 1);
      setComposerOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div>
      <section className="border-b border-line bg-noise">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Pillar 03"
            title="Support"
            description="Nobody builds power alone. Call for backup when you need capital, mentorship, or manpower — and answer the call when you've already got what someone else is reaching for."
          />
        </div>
      </section>

      {/* The standing order */}
      <section className="border-b border-line bg-gold/5">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-gold" size={20} />
            <p className="text-sm text-bone-dim">
              <span className="font-semibold text-bone">The standing order:</span> every member who's
              made a move backs the member trying to make theirs. This board is where that happens —
              in the open, member to member.
            </p>
          </div>
        </div>
      </section>

      {/* Backing board */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-lg border border-line p-1">
            {[
              ["all", "All"],
              ["request", "Calls for backup"],
              ["offer", "Backing offered"],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  filter === val ? "bg-gold text-ink" : "text-bone-dim hover:text-bone"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openComposer("request")}
              className="flex items-center gap-1.5 rounded-lg border border-line px-4 py-2 text-sm font-semibold text-bone hover:border-crimson hover:text-crimson"
            >
              <HandCoins size={16} /> Call for backup
            </button>
            <button
              onClick={() => openComposer("offer")}
              className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-bold text-ink hover:bg-gold-soft"
            >
              <HandHeart size={16} /> Answer the call
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading && (
            <p className="col-span-full rounded-xl border border-dashed border-line p-8 text-center text-sm text-bone-dim">
              Loading the board...
            </p>
          )}
          {!loading && filtered.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed border-line p-8 text-center text-sm text-bone-dim">
              Nothing here yet — be the first to post.
            </p>
          )}
          {filtered.map((item) => (
            <div key={item.id} className="card-hover rounded-2xl border border-line bg-panel p-5">
              <div className="flex items-center justify-between">
                <Badge color={item.type === "request" ? "crimson" : "emerald"}>
                  {item.type === "request" ? "Calling for backup" : "Backing offered"}
                </Badge>
                <span className="text-xs text-bone-dim">{timeAgo(item.created_at)}</span>
              </div>
              <h3 className="mt-3 font-display text-base font-semibold text-bone">{item.title}</h3>
              <p className="mt-1 text-sm text-bone-dim">{item.detail}</p>
              <p className="mt-3 flex items-center gap-1 text-xs text-bone-dim">
                <MapPin size={12} /> {item.city}
              </p>
              <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                <Avatar name={item.author.name} color={item.author.avatar_color} size={26} />
                <span className="text-xs text-bone-dim">{item.author.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {composerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setComposerOpen(false)}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-line bg-panel p-6 animate-fade-up"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-bone">
                {form.type === "request" ? "Call the ranks for backup" : "Offer your backing"}
              </h3>
              <button type="button" onClick={() => setComposerOpen(false)} className="text-bone-dim hover:text-bone">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 flex rounded-lg border border-line p-1">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: "request" }))}
                className={`flex-1 rounded-md py-1.5 text-sm font-medium ${
                  form.type === "request" ? "bg-crimson text-bone" : "text-bone-dim"
                }`}
              >
                Calling for backup
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: "offer" }))}
                className={`flex-1 rounded-md py-1.5 text-sm font-medium ${
                  form.type === "offer" ? "bg-emerald text-bone" : "text-bone-dim"
                }`}
              >
                Offering backing
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Short, clear title"
                className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/50 outline-none focus:border-gold"
              />
              <textarea
                value={form.detail}
                onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))}
                placeholder="Details — what you need, or what you're putting on the table"
                rows={3}
                className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/50 outline-none focus:border-gold"
              />
              <CityStateField
                key={fieldKey}
                value={form.city}
                onChange={(city) => setForm((f) => ({ ...f, city }))}
              />
            </div>
            {formError && <p className="mt-3 text-sm text-crimson">{formError}</p>}
            <button
              type="submit"
              disabled={posting}
              className="mt-4 w-full rounded-lg bg-gold py-2.5 text-sm font-bold text-ink hover:bg-gold-soft disabled:opacity-60"
            >
              {posting ? "Posting..." : "Post to the board"}
            </button>
          </form>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
