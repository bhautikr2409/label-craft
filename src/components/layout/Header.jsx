import { Link } from 'react-router-dom';
import { SITE_NAME } from '../../constants/site';
import { TOOLS } from '../../constants/toolsCatalog';
import ToolIcon from '../tools/ToolIcon';

const navLinkClass =
  'inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-slate-600 transition hover:bg-teal-50 hover:text-teal-800';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${SITE_NAME} home`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white">
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
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Label<span className="text-teal-700">Craft</span>
          </span>
        </Link>

        <div className="ml-2 hidden items-center gap-1 lg:flex">
          {TOOLS.map((tool) => (
            <Link key={tool.id} to={tool.to} className={navLinkClass}>
              {tool.title}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/guide"
            className="hidden h-9 items-center rounded-lg px-2 text-sm font-semibold text-slate-600 transition hover:text-teal-800 sm:inline-flex"
          >
            Help
          </Link>
          <Link
            to="/"
            className="inline-flex h-9 items-center rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            All tools
          </Link>
        </div>
      </nav>

      <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
        {TOOLS.map((tool) => (
          <Link
            key={tool.id}
            to={tool.to}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            <ToolIcon name={tool.icon} className="[&>svg]:h-4 [&>svg]:w-4" />
            {tool.title}
          </Link>
        ))}
      </div>
    </header>
  );
}
