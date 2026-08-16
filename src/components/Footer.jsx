import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width={16} height={16} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
      <path d="M18.9 3H21l-6.9 7.9L22.2 21h-6.4l-5-6.5L4.9 21H2.8l7.4-8.5L2 3h6.6l4.5 5.9L18.9 3Zm-1.1 16.2h1.2L7.3 4.7H6l11.8 14.5Z" />
    </svg>
  );
}

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width={16} height={16} {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink-soft">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <Shield className="text-gold" size={22} />
              <span className="font-display text-base font-bold text-bone">
                THE <span className="text-gold">VANGUARD</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-bone-dim">
              An order of minority builders, operators, and leaders — connected, informed, backed,
              and supplied to keep power moving forward.
            </p>
            <p className="mt-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Power Over Everything
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Instagram" className="rounded-full border border-line p-2 text-bone-dim hover:border-gold hover:text-gold">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="X (Twitter)" className="rounded-full border border-line p-2 text-bone-dim hover:border-gold hover:text-gold">
                <XIcon />
              </a>
              <a href="#" aria-label="YouTube" className="rounded-full border border-line p-2 text-bone-dim hover:border-gold hover:text-gold">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-bone">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-bone-dim">
              <li><Link to="/connect" className="hover:text-gold">Connect</Link></li>
              <li><Link to="/inform" className="hover:text-gold">Inform</Link></li>
              <li><Link to="/support" className="hover:text-gold">Support</Link></li>
              <li><Link to="/supply" className="hover:text-gold">Supply</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-bone">Community</h4>
            <ul className="mt-3 space-y-2 text-sm text-bone-dim">
              <li><Link to="/events" className="hover:text-gold">Events</Link></li>
              <li><Link to="/about" className="hover:text-gold">About us</Link></li>
              <li><Link to="/support" className="hover:text-gold">The backing board</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-bone">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-bone-dim">
              <li><a href="#" className="hover:text-gold">Privacy</a></li>
              <li><a href="#" className="hover:text-gold">Terms</a></li>
              <li><a href="#" className="hover:text-gold">Community guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-bone-dim/70 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} The Vanguard. Built by the community, for the community.</p>
          <p>This is a demo experience — data is stored locally in your browser only.</p>
        </div>
      </div>
    </footer>
  );
}
