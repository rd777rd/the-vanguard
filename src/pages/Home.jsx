import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Quote } from "lucide-react";
import { PILLARS, STATS, TAGS } from "../data/seed";
import { api } from "../lib/api";
import PillarCard from "../components/PillarCard";
import SectionHeading from "../components/SectionHeading";
import StatBlock from "../components/StatBlock";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";

const TESTIMONIALS = [
  {
    quote:
      "I found three mentors and my first two clients through The Vanguard in under a month. This is what community is supposed to feel like.",
    name: "Dominique Carter",
    role: "Contractor, Detroit",
  },
  {
    quote:
      "The know-your-rights library gave my whole family a plan we actually understood, in language that respected us.",
    name: "Sofia Reyes",
    role: "Paralegal, Houston",
  },
  {
    quote:
      "We started a savings circle with people we met here. Two members have opened businesses since.",
    name: "Amara Johnson",
    role: "Organizer, Atlanta",
  },
];

export default function Home() {
  const { currentUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [spotlight, setSpotlight] = useState([]);

  useEffect(() => {
    api
      .get("/members/")
      .then((members) => setSpotlight(members.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-noise">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-bone-dim animate-fade-up">
              <Shield size={14} className="text-gold" />
              An order of minority builders, operators & leaders
            </div>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] text-bone sm:text-6xl animate-fade-up">
              Connect. Inform. Support. Supply.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl font-display text-2xl font-black uppercase tracking-wide text-gradient-gold sm:text-3xl animate-fade-up">
              Power Over Everything
            </p>

            <p className="mx-auto mt-6 max-w-xl text-base text-bone-dim animate-fade-up">
              The Vanguard is where minority builders, operators, and leaders find their circle,
              sharpen their edge, back each other's next move, and keep power circulating inside
              the community instead of leaking out of it.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up">
              {currentUser ? (
                <Link
                  to="/connect"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:bg-gold-soft sm:w-auto"
                >
                  Go to the community <ArrowRight size={16} />
                </Link>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:bg-gold-soft sm:w-auto"
                >
                  Request Membership <ArrowRight size={16} />
                </button>
              )}
              <Link
                to="/about"
                className="w-full rounded-lg border border-line px-6 py-3 text-center text-sm font-semibold text-bone transition hover:border-gold hover:text-gold sm:w-auto"
              >
                Learn our story
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {TAGS.slice(0, 8).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-ink-soft py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {STATS.map((s) => (
            <StatBlock key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Four pillars. One order."
          description="Everything on The Vanguard rolls up into four simple pillars — pick the one that moves you forward today."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <PillarCard key={pillar.key} pillar={pillar} />
          ))}
        </div>
      </section>

      {/* Member spotlight */}
      <section className="border-y border-line bg-ink-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Faces of the order"
            title="You're joining operators, not a feed."
            description="A few of the members already building with The Vanguard."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {spotlight.map((m) => (
              <div key={m.id} className="card-hover rounded-2xl border border-line bg-panel p-5">
                <div className="flex items-center gap-3">
                  <Avatar name={m.name} color={m.avatar_color} size={44} />
                  <div>
                    <p className="font-semibold text-bone">{m.name}</p>
                    <p className="text-xs text-bone-dim">{m.role}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-bone-dim">{m.bio}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.tags.map((t) => (
                    <Badge key={t} color="gold">{t}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/connect" className="text-sm font-semibold text-gold hover:underline">
              Meet the full community &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="In their words" title="What power looks like, day to day" align="center" />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-line bg-panel p-6">
              <Quote className="text-gold" size={22} />
              <p className="mt-3 text-sm text-bone-dim">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-bone">{t.name}</p>
              <p className="text-xs text-bone-dim">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-panel to-ink-soft px-6 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/10 blur-3xl animate-pulse-slow" />
          <h2 className="font-display text-3xl font-bold text-bone sm:text-4xl">
            The ranks are already assembling.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-bone-dim">
            Come build your circle, sharpen your edge, back someone's next move, and keep
            opportunity moving through the community. Membership is free — what you build with it
            is on you.
          </p>
          {!currentUser && (
            <button
              onClick={() => setAuthOpen(true)}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-gold px-7 py-3 text-sm font-bold text-ink transition hover:bg-gold-soft"
            >
              Request Membership <ArrowRight size={16} />
            </button>
          )}
        </div>
      </section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
