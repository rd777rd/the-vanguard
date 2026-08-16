export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  const isCenter = align === "center";
  return (
    <div className={`max-w-2xl ${isCenter ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 font-display text-3xl font-bold text-bone sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-bone-dim">{description}</p>}
    </div>
  );
}
