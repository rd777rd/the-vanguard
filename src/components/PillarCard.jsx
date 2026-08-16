import { Link } from "react-router-dom";
import { ArrowUpRight, Users, BookOpen, HeartHandshake, Boxes } from "lucide-react";

const ICONS = { connect: Users, inform: BookOpen, support: HeartHandshake, supply: Boxes };

const TEXT_COLOR = {
  gold: "text-gold",
  azure: "text-azure",
  crimson: "text-crimson",
  emerald: "text-emerald",
};

const BORDER_HOVER = {
  gold: "hover:border-gold",
  azure: "hover:border-azure",
  crimson: "hover:border-crimson",
  emerald: "hover:border-emerald",
};

export default function PillarCard({ pillar }) {
  const Icon = ICONS[pillar.key];
  return (
    <Link
      to={pillar.href}
      className={`card-hover group flex flex-col justify-between rounded-2xl border border-line bg-panel p-6 ${BORDER_HOVER[pillar.color]}`}
    >
      <div>
        <div className={`inline-flex rounded-xl border border-line p-3 ${TEXT_COLOR[pillar.color]}`}>
          <Icon size={22} />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-bone">{pillar.title}</h3>
        <p className={`mt-1 text-sm font-semibold ${TEXT_COLOR[pillar.color]}`}>{pillar.tagline}</p>
        <p className="mt-3 text-sm text-bone-dim">{pillar.description}</p>
      </div>
      <div className="mt-6 flex items-center gap-1 text-sm font-medium text-bone-dim group-hover:text-bone">
        Explore {pillar.title}
        <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
