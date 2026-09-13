import { Link } from 'react-router-dom';
import { TOOLS } from '../../constants/toolsCatalog';

const COMPANY_LINKS = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/blog', label: 'Blog' },
  { to: '/guide', label: 'Help & Guides' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="text-sm text-slate-400 transition-colors hover:text-teal-300">
      {children}
    </Link>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer data-site-footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link to="/" className="mb-4 inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                <svg viewBox="0 0 32 32" className="h-4 w-4" fill="none" aria-hidden="true">
                  <rect x="7" y="5" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2.25" />
                  <path
                    d="M11 12h6M11 16h6M11 20h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Ecom<span className="text-teal-400">Crop</span>
              </span>
            </Link>
            <p className="mb-5 max-w-sm text-sm leading-relaxed text-slate-400">
              Free shipping-label tools for Flipkart, Meesho, and Amazon sellers. Crop, sort, brand,
              and inject SKUs entirely in your browser.
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg border border-teal-800/60 bg-teal-950/50 px-3 py-2 text-xs font-semibold text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              100% client-side · No uploads
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-slate-300">
              Tools
            </h4>
            <ul className="space-y-2.5">
              {TOOLS.map((tool) => (
                <li key={tool.id}>
                  <FooterLink to={tool.to}>{tool.title}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-slate-300">
              Company
            </h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.to}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-slate-300">
              Get started
            </h4>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Open any marketplace label tool and process PDFs privately.
            </p>
            <Link
              to="/"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-500"
            >
              All tools
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6">
          <p>© {currentYear} EcomCrop. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-slate-300">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-slate-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
