import { useState } from "react";
import { Plus, X, Search, MapPin, Tag, Briefcase, Store } from "lucide-react";
import { useApiCollection } from "../hooks/useApiCollection";
import { useAuth } from "../context/AuthContext";
import SectionHeading from "../components/SectionHeading";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import AuthModal from "../components/AuthModal";
import CityStateField from "../components/CityStateField";

const TYPE_LABEL = { good: "Good", service: "Service", job: "Job" };
const TYPE_COLOR = { good: "gold", service: "azure", job: "emerald" };

export default function Supply() {
  const { currentUser } = useAuth();
  const { items: listings, loading: listingsLoading, create: createListing } = useApiCollection("/listings/");
  const { items: businesses, loading: businessesLoading } = useApiCollection("/businesses/");
  const [tab, setTab] = useState("market");
  const [typeFilter, setTypeFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [form, setForm] = useState({ type: "good", title: "", price: "", city: "", category: "General" });
  const [fieldKey, setFieldKey] = useState(0);
  const [posting, setPosting] = useState(false);
  const [formError, setFormError] = useState("");

  const filteredListings = listings.filter((l) => {
    const matchesType = typeFilter === "all" || l.type === typeFilter;
    const matchesQuery = query.trim() === "" || l.title.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  const filteredBusinesses = businesses.filter(
    (b) =>
      query.trim() === "" ||
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.category.toLowerCase().includes(query.toLowerCase())
  );

  function openComposer() {
    if (!currentUser) return setAuthOpen(true);
    setComposerOpen(true);
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.price.trim()) return;
    setPosting(true);
    setFormError("");
    try {
      await createListing({
        type: form.type,
        title: form.title.trim(),
        price: form.price.trim(),
        city: form.city || "Remote / Online",
        category: form.category,
      });
      setForm({ type: "good", title: "", price: "", city: "", category: "General" });
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
            eyebrow="Pillar 04"
            title="Supply"
            description="Keep the power circulating. Buy, sell, hire, and get hired within the community — and put minority-owned businesses first."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-lg border border-line p-1">
            <button
              onClick={() => setTab("market")}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${
                tab === "market" ? "bg-gold text-ink" : "text-bone-dim hover:text-bone"
              }`}
            >
              <Briefcase size={15} /> Marketplace
            </button>
            <button
              onClick={() => setTab("businesses")}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${
                tab === "businesses" ? "bg-gold text-ink" : "text-bone-dim hover:text-bone"
              }`}
            >
              <Store size={15} /> Business directory
            </button>
          </div>
          {tab === "market" && (
            <button
              onClick={openComposer}
              className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-bold text-ink hover:bg-gold-soft"
            >
              <Plus size={16} /> Post a listing
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-dim" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tab === "market" ? "Search goods, services, jobs..." : "Search businesses..."}
              className="w-full rounded-lg border border-line bg-panel py-2.5 pl-9 pr-3 text-sm text-bone placeholder:text-bone-dim/60 outline-none focus:border-gold"
            />
          </div>
          {tab === "market" && (
            <div className="inline-flex rounded-lg border border-line p-1">
              {[
                ["all", "All"],
                ["good", "Goods"],
                ["service", "Services"],
                ["job", "Jobs"],
              ].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setTypeFilter(val)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    typeFilter === val ? "bg-panel-raised text-gold" : "text-bone-dim hover:text-bone"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {tab === "market" ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listingsLoading && (
              <p className="col-span-full rounded-xl border border-dashed border-line p-8 text-center text-sm text-bone-dim">
                Loading the marketplace...
              </p>
            )}
            {!listingsLoading && filteredListings.length === 0 && (
              <p className="col-span-full rounded-xl border border-dashed border-line p-8 text-center text-sm text-bone-dim">
                Nothing here yet — be the first to post.
              </p>
            )}
            {filteredListings.map((l) => (
              <div key={l.id} className="card-hover rounded-2xl border border-line bg-panel p-5">
                <div className="flex items-center justify-between">
                  <Badge color={TYPE_COLOR[l.type]}>{TYPE_LABEL[l.type]}</Badge>
                  <span className="flex items-center gap-1 text-xs text-bone-dim">
                    <Tag size={12} /> {l.category}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-bone">{l.title}</h3>
                <p className="mt-1 font-semibold text-gold">{l.price}</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-bone-dim">
                  <MapPin size={12} /> {l.city}
                </p>
                <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                  <Avatar name={l.seller.name} color={l.seller.avatar_color} size={26} />
                  <span className="text-xs text-bone-dim">{l.seller.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businessesLoading && (
              <p className="col-span-full rounded-xl border border-dashed border-line p-8 text-center text-sm text-bone-dim">
                Loading the directory...
              </p>
            )}
            {filteredBusinesses.map((b) => (
              <div key={b.id} className="card-hover rounded-2xl border border-line bg-panel p-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-lg border border-line p-2 text-emerald">
                    <Store size={18} />
                  </span>
                  <Badge>{b.category}</Badge>
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-bone">{b.name}</h3>
                <p className="mt-1 text-sm text-bone-dim">Owned by {b.owner ? b.owner.name : b.owner_name}</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-bone-dim">
                  <MapPin size={12} /> {b.city}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {b.tags.map((t) => (
                    <Badge key={t} color="gold">{t}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
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
              <h3 className="font-display text-xl font-bold text-bone">Post a listing</h3>
              <button type="button" onClick={() => setComposerOpen(false)} className="text-bone-dim hover:text-bone">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone outline-none focus:border-gold"
              >
                <option value="good">Good</option>
                <option value="service">Service</option>
                <option value="job">Job</option>
              </select>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="What are you offering?"
                className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/50 outline-none focus:border-gold"
              />
              <input
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="Price, rate, or 'free / trade'"
                className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/50 outline-none focus:border-gold"
              />
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Category (e.g. Home, Jobs, Career)"
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
              {posting ? "Posting..." : "Post listing"}
            </button>
          </form>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
