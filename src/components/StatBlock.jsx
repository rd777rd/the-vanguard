export default function StatBlock({ value, label }) {
  const formatted = value >= 1000 ? `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K+` : `${value}+`;
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold text-gold sm:text-4xl">{formatted}</p>
      <p className="mt-1 text-sm text-bone-dim">{label}</p>
    </div>
  );
}
