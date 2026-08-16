import { useMemo, useState } from "react";
import { Search, Clock, X, ArrowRight, Scale, PiggyBank, HeartPulse, GraduationCap, Landmark, BookOpen } from "lucide-react";
import { useApiCollection } from "../hooks/useApiCollection";
import SectionHeading from "../components/SectionHeading";
import Badge from "../components/Badge";

const CATEGORY_ICON = {
  "Know Your Rights": Scale,
  "Financial Literacy": PiggyBank,
  "Health & Wellness": HeartPulse,
  Education: GraduationCap,
  "Civic Power": Landmark,
};

export default function Inform() {
  const { items: resources, loading } = useApiCollection("/resources/");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  const categories = useMemo(
    () => [...new Set(resources.map((r) => r.category))],
    [resources]
  );

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchesCategory = category === "All" || r.category === category;
      const matchesQuery =
        query.trim() === "" ||
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.summary.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [resources, category, query]);

  return (
    <div>
      <section className="border-b border-line bg-noise">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Pillar 02"
            title="Inform"
            description="Strategic knowledge on rights, capital, health, and civic power — written plainly, by members who've already played the hand you're holding."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-dim" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the library..."
              className="w-full rounded-lg border border-line bg-panel py-2.5 pl-9 pr-3 text-sm text-bone placeholder:text-bone-dim/60 outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("All")}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              category === "All" ? "border-gold bg-gold/15 text-gold" : "border-line text-bone-dim hover:border-bone-dim"
            }`}
          >
            All topics
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                category === c ? "border-gold bg-gold/15 text-gold" : "border-line text-bone-dim hover:border-bone-dim"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading && (
            <p className="col-span-full rounded-xl border border-dashed border-line p-8 text-center text-sm text-bone-dim">
              Loading the library...
            </p>
          )}
          {!loading && filtered.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed border-line p-8 text-center text-sm text-bone-dim">
              Nothing matches that search yet.
            </p>
          )}
          {filtered.map((r) => {
            const Icon = CATEGORY_ICON[r.category] || BookOpen;
            return (
              <button
                key={r.id}
                onClick={() => setActive(r)}
                className="card-hover flex flex-col rounded-2xl border border-line bg-panel p-5 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-lg border border-line p-2 text-azure">
                    <Icon size={18} />
                  </span>
                  <Badge>{r.category}</Badge>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-bone">{r.title}</h3>
                <p className="mt-2 flex-1 text-sm text-bone-dim">{r.summary}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-bone-dim">
                    <Clock size={14} /> {r.minutes} min read
                  </span>
                  <span className="flex items-center gap-1 font-medium text-gold">
                    Read <ArrowRight size={14} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-line bg-panel p-6 sm:p-8 animate-fade-up"
          >
            <div className="flex items-start justify-between gap-4">
              <Badge color="azure">{active.category}</Badge>
              <button onClick={() => setActive(null)} className="text-bone-dim hover:text-bone">
                <X size={20} />
              </button>
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-bone">{active.title}</h2>
            <p className="mt-1 flex items-center gap-1 text-xs text-bone-dim">
              <Clock size={12} /> {active.minutes} min read
            </p>
            <p className="mt-5 text-sm leading-relaxed text-bone-dim">{active.body}</p>
            <p className="mt-6 rounded-lg border border-line bg-ink-soft p-3 text-xs text-bone-dim">
              This is general community information, not legal, medical, or financial advice.
              Laws and programs vary by location — confirm specifics with a local professional
              or official source before acting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
