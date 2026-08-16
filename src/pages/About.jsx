import { Shield, Users, BookOpen, HeartHandshake, Boxes, Target, Eye, Flame } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { STATS, PILLARS } from "../data/seed";
import StatBlock from "../components/StatBlock";

const VALUES = [
  {
    icon: Shield,
    title: "Solidarity first",
    text: "We show up for each other before we're asked twice. Power is built collectively or not at all.",
  },
  {
    icon: Eye,
    title: "Radical transparency",
    text: "No hidden algorithms deciding who gets seen. What the community values rises — plainly, visibly.",
  },
  {
    icon: Flame,
    title: "Unapologetic pride",
    text: "This space exists for us, named for us, without needing to explain or soften why.",
  },
  {
    icon: Target,
    title: "Action over talk",
    text: "Every pillar — Connect, Inform, Support, Supply — is built to move something real, not just conversation.",
  },
];

const CREED = [
  {
    numeral: "I",
    pillar: "Connect",
    line: "We connect with intention — every relationship here is built to move something forward.",
  },
  {
    numeral: "II",
    pillar: "Inform",
    line: "We inform without gatekeeping — knowledge earned inside the order is knowledge shared inside it.",
  },
  {
    numeral: "III",
    pillar: "Support",
    line: "We back each other before we're asked twice — no one rises alone, and no one stands alone at the top either.",
  },
  {
    numeral: "IV",
    pillar: "Supply",
    line: "We supply our own first — every dollar, every job, every contract circulates inside before it's allowed to leave.",
  },
  {
    numeral: "V",
    pillar: null,
    line: "Above all else — power over everything.",
  },
];

const ICONS = { connect: Users, inform: BookOpen, support: HeartHandshake, supply: Boxes };

export default function About() {
  return (
    <div>
      <section className="border-b border-line bg-noise">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-gold">Our story</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-bone sm:text-5xl">
            Built because we needed it ourselves.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-bone-dim">
            The Vanguard started as a group chat between organizers, tradespeople, nurses, and
            students who kept independently rebuilding the same thing: a circle that finds each
            other, sharpens each other, and backs each other's next move. We put it in one house
            with one standard, so the next builder wouldn't have to start from zero — and so power,
            once built, would stay in the family.
          </p>
          <p className="mx-auto mt-6 font-display text-xl font-black uppercase tracking-widest text-gradient-gold">
            Power Over Everything
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-gold">Our mission</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-bone sm:text-4xl">
              Power comes from people organized around each other.
            </h2>
            <p className="mt-4 text-bone-dim">
              Minority communities have always built power the same way — by pooling what we have:
              knowledge, skill, capital, time, trust. The Vanguard takes that instinct and gives it
              structure: a standing order where finding your circle, sharpening your edge, calling
              in backup, and keeping opportunity circulating inside the community isn't left to
              chance. It's the standard every member operates by.
            </p>
            <p className="mt-4 text-bone-dim">
              This isn't a charity and it isn't a support group — it's an alliance. We're not here
              to replace mutual aid, unions, churches, or block associations; we're here to connect
              them, sharpen them, and hand you the tools to start your own.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {PILLARS.map((p) => {
              const Icon = ICONS[p.key];
              return (
                <div key={p.key} className="rounded-2xl border border-line bg-panel p-5">
                  <Icon className="text-gold" size={22} />
                  <p className="mt-3 font-display font-bold text-bone">{p.title}</p>
                  <p className="mt-1 text-xs text-bone-dim">{p.tagline}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Creed */}
      <section className="border-y border-line bg-ink-soft py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="What we hold each other to" title="The Vanguard Creed" align="center" />
          <div className="mt-10 space-y-3">
            {CREED.map((c) => (
              <div
                key={c.numeral}
                className="flex items-start gap-5 rounded-2xl border border-line bg-panel p-5 sm:items-center"
              >
                <span className="font-display text-2xl font-black text-gold">{c.numeral}</span>
                <div className="min-w-0">
                  {c.pillar && (
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bone-dim">{c.pillar}</p>
                  )}
                  <p className={`text-bone ${c.pillar ? "mt-1" : "font-display text-lg font-bold uppercase tracking-wide text-gold"}`}>
                    {c.line}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="What we stand for" title="Our values" align="center" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-line bg-panel p-6 text-center">
              <div className="mx-auto inline-flex rounded-xl border border-line p-3 text-gold">
                <v.icon size={22} />
              </div>
              <h3 className="mt-4 font-display font-bold text-bone">{v.title}</h3>
              <p className="mt-2 text-sm text-bone-dim">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-ink-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="By the numbers" title="Power we've already built together" align="center" />
          <div className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((s) => (
              <StatBlock key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
