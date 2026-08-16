const COLOR_MAP = {
  gold: "bg-gold/10 text-gold border-gold/30",
  azure: "bg-azure/10 text-azure border-azure/30",
  crimson: "bg-crimson/10 text-crimson border-crimson/30",
  emerald: "bg-emerald/10 text-emerald border-emerald/30",
  bone: "bg-bone/10 text-bone-dim border-bone/20",
};

export default function Badge({ children, color = "bone", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide ${COLOR_MAP[color] || COLOR_MAP.bone} ${className}`}
    >
      {children}
    </span>
  );
}
