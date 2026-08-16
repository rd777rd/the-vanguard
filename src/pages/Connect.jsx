import { useEffect, useMemo, useState } from "react";
import { Search, Heart, MessageCircle, MapPin, Plus, X } from "lucide-react";
import { TAGS } from "../data/seed";
import { useApiCollection } from "../hooks/useApiCollection";
import { api } from "../lib/api";
import { timeAgo } from "../lib/store";
import { useAuth } from "../context/AuthContext";
import SectionHeading from "../components/SectionHeading";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import AuthModal from "../components/AuthModal";

export default function Connect() {
  const { currentUser } = useAuth();
  const { items: discussions, loading: discussionsLoading, create: createDiscussion, updateLocal } =
    useApiCollection("/discussions/");
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [tab, setTab] = useState("feed");
  const [tagFilter, setTagFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", tag: TAGS[0] });
  const [posting, setPosting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    api
      .get("/members/")
      .then(setMembers)
      .finally(() => setMembersLoading(false));
  }, []);

  const cityOptions = useMemo(
    () => [...new Set(members.map((m) => m.city).filter(Boolean))].sort(),
    [members]
  );

  const filteredMembers = members.filter((m) => {
    const matchesTag = tagFilter === "All" || m.tags.includes(tagFilter);
    const matchesCity = cityFilter === "All" || m.city === cityFilter;
    const matchesQuery =
      query.trim() === "" ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.role.toLowerCase().includes(query.toLowerCase());
    return matchesTag && matchesCity && matchesQuery;
  });

  const filteredDiscussions = discussions.filter((d) => tagFilter === "All" || d.tag === tagFilter);

  async function toggleLike(id) {
    if (!currentUser) return setAuthOpen(true);
    try {
      const { likes, liked } = await api.post(`/discussions/${id}/like/`, {});
      updateLocal(id, { likes, liked_by_me: liked });
    } catch {
      // ignore — like is a nicety, not worth surfacing an error toast for
    }
  }

  function openComposer() {
    if (!currentUser) return setAuthOpen(true);
    setComposerOpen(true);
  }

  async function submitDiscussion(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setPosting(true);
    setFormError("");
    try {
      await createDiscussion({ tag: form.tag, title: form.title.trim(), body: form.body.trim() });
      setForm({ title: "", body: "", tag: TAGS[0] });
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
            eyebrow="Pillar 01"
            title="Connect"
            description="Meet the builders, operators, and leaders in your city and beyond. Join the conversation, or find the circle already at work on what matters to you."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-lg border border-line p-1">
            <button
              onClick={() => setTab("feed")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                tab === "feed" ? "bg-gold text-ink" : "text-bone-dim hover:text-bone"
              }`}
            >
              Discussion feed
            </button>
            <button
              onClick={() => setTab("members")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                tab === "members" ? "bg-gold text-ink" : "text-bone-dim hover:text-bone"
              }`}
            >
              Member directory
            </button>
          </div>
          {tab === "feed" && (
            <button
              onClick={openComposer}
              className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-bold text-ink hover:bg-gold-soft"
            >
              <Plus size={16} /> Start a discussion
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          {tab === "members" && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-dim" size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search members by name or role..."
                className="w-full rounded-lg border border-line bg-panel py-2.5 pl-9 pr-3 text-sm text-bone placeholder:text-bone-dim/60 outline-none focus:border-gold"
              />
            </div>
          )}
          {tab === "members" && (
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="rounded-lg border border-line bg-panel px-3 py-2.5 text-sm text-bone outline-none focus:border-gold"
            >
              <option>All</option>
              {cityOptions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          )}
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="rounded-lg border border-line bg-panel px-3 py-2.5 text-sm text-bone outline-none focus:border-gold"
          >
            <option>All</option>
            {TAGS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Feed */}
        {tab === "feed" && (
          <div className="mt-8 space-y-4">
            {discussionsLoading && (
              <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-bone-dim">
                Loading the feed...
              </p>
            )}
            {!discussionsLoading && filteredDiscussions.length === 0 && (
              <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-bone-dim">
                No discussions with that tag yet. Be the first to start one.
              </p>
            )}
            {filteredDiscussions.map((d) => (
              <div key={d.id} className="card-hover rounded-2xl border border-line bg-panel p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={d.author.name} color={d.author.avatar_color} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-bone">{d.author.name}</p>
                      <span className="text-xs text-bone-dim">{timeAgo(d.created_at)}</span>
                      <Badge color="gold">{d.tag}</Badge>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold text-bone">{d.title}</h3>
                    <p className="mt-1 text-sm text-bone-dim">{d.body}</p>
                    <div className="mt-4 flex items-center gap-5 text-sm text-bone-dim">
                      <button
                        onClick={() => toggleLike(d.id)}
                        className={`flex items-center gap-1.5 transition ${d.liked_by_me ? "text-crimson" : "hover:text-bone"}`}
                      >
                        <Heart size={16} fill={d.liked_by_me ? "currentColor" : "none"} />
                        {d.likes}
                      </button>
                      <span className="flex items-center gap-1.5">
                        <MessageCircle size={16} /> {d.replies}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Members */}
        {tab === "members" && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {membersLoading && (
              <p className="col-span-full rounded-xl border border-dashed border-line p-8 text-center text-sm text-bone-dim">
                Loading the directory...
              </p>
            )}
            {!membersLoading && filteredMembers.length === 0 && (
              <p className="col-span-full rounded-xl border border-dashed border-line p-8 text-center text-sm text-bone-dim">
                No members match those filters yet.
              </p>
            )}
            {filteredMembers.map((m) => (
              <div key={m.id} className="card-hover rounded-2xl border border-line bg-panel p-5">
                <div className="flex items-center gap-3">
                  <Avatar name={m.name} color={m.avatar_color} size={44} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-bone">{m.name}</p>
                    <p className="truncate text-xs text-bone-dim">{m.role}</p>
                  </div>
                </div>
                <p className="mt-3 flex items-center gap-1 text-xs text-bone-dim">
                  <MapPin size={12} /> {m.city}
                </p>
                <p className="mt-2 text-sm text-bone-dim">{m.bio}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Composer modal */}
      {composerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setComposerOpen(false)}
        >
          <form
            onSubmit={submitDiscussion}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-line bg-panel p-6 animate-fade-up"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-bone">Start a discussion</h3>
              <button type="button" onClick={() => setComposerOpen(false)} className="text-bone-dim hover:text-bone">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Give it a clear title"
                className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/50 outline-none focus:border-gold"
              />
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                placeholder="What do you want to share or ask?"
                rows={4}
                className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/50 outline-none focus:border-gold"
              />
              <select
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone outline-none focus:border-gold"
              >
                {TAGS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            {formError && <p className="mt-3 text-sm text-crimson">{formError}</p>}
            <button
              type="submit"
              disabled={posting}
              className="mt-4 w-full rounded-lg bg-gold py-2.5 text-sm font-bold text-ink hover:bg-gold-soft disabled:opacity-60"
            >
              {posting ? "Posting..." : "Post to the community"}
            </button>
          </form>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
