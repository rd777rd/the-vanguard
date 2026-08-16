export default function Avatar({ name, color = "#e8b008", size = 40, className = "" }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-bold text-ink ${className}`}
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
