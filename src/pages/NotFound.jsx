import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <Shield className="text-gold" size={40} />
      <h1 className="mt-4 font-display text-4xl font-bold text-bone">404</h1>
      <p className="mt-2 text-bone-dim">This page isn't part of The Vanguard yet.</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-ink hover:bg-gold-soft"
      >
        Back to home
      </Link>
    </div>
  );
}
