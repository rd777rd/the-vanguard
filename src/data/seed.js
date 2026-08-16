// Static brand content for The Vanguard — the pillar copy, the fixed identity
// tag vocabulary, and the marketing stat strip. Everything else (members,
// discussions, the backing board, marketplace listings, businesses, events,
// and the resource library) is real content served by the Django API — see
// src/lib/api.js and src/hooks/useApiCollection.js.

export const PILLARS = [
  {
    key: "connect",
    title: "Connect",
    tagline: "Build your circle of power.",
    description:
      "This isn't networking for its own sake. Find the builders, operators, and leaders in your city and beyond — the kind of relationships that move deals, not just conversations.",
    href: "/connect",
    color: "gold",
  },
  {
    key: "inform",
    title: "Inform",
    tagline: "Master the game.",
    description:
      "Strategic knowledge on rights, capital, health, and civic power — written plainly, by members who've already played the hand you're holding.",
    href: "/inform",
    color: "azure",
  },
  {
    key: "support",
    title: "Support",
    tagline: "Nobody rises alone.",
    description:
      "Call for backup or answer the call — capital, mentorship, manpower, connections. Every member here is expected to back the one climbing behind them.",
    href: "/support",
    color: "crimson",
  },
  {
    key: "supply",
    title: "Supply",
    tagline: "Keep the power circulating.",
    description:
      "A marketplace built to keep every dollar, every job, every contract moving inside the community instead of leaking out of it. Minority-owned, first.",
    href: "/supply",
    color: "emerald",
  },
];

export const TAGS = [
  "Black-owned",
  "Latine",
  "AAPI",
  "Indigenous",
  "LGBTQ+",
  "Disability",
  "Immigrant",
  "Women",
  "Veterans",
  "Youth",
  "Elders",
  "First-gen",
];

export const STATS = [
  { label: "Members", value: 18240 },
  { label: "Cities", value: 96 },
  { label: "Power moves backed", value: 3120 },
  { label: "Minority-owned businesses listed", value: 1450 },
];
