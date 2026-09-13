import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SITE_NAME } from '../../constants/site';
import { TOOLS } from '../../constants/toolsCatalog';
import ToolIcon from '../tools/ToolIcon';

const navLinkClass =
  'inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-slate-600 transition hover:bg-teal-50 hover:text-teal-800';

const navLinkActiveClass =
  'inline-flex h-9 items-center rounded-lg bg-teal-50 px-3 text-sm font-semibold text-teal-800';

const LABEL_CROP_ITEMS = [
  { id: 'flipkart', label: 'Flipkart', to: '/label-crop?platform=flipkart' },
  { id: 'meesho', label: 'Meesho', to: '/label-crop?platform=meesho' },
];

function LabelCropNavDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const menuId = useId();
  const location = useLocation();
  const isActive = location.pathname === '/label-crop';

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={isActive ? navLinkActiveClass : navLinkClass}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        Label Crop
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`ml-1 h-4 w-4 transition ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Label Crop marketplace"
          className="absolute left-0 top-full z-50 mt-1 min-w-[11rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {LABEL_CROP_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              role="menuitem"
              className="block px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-800"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function Header() {
  return (
    <header
      data-site-header
      className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur"
    >
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
            Ecom<span className="text-teal-700">Crop</span>
          </span>
        </Link>

        <div className="ml-2 hidden items-center gap-1 lg:flex">
          {TOOLS.map((tool) =>
            tool.id === 'label-crop' ? (
              <LabelCropNavDropdown key={tool.id} />
            ) : (
              <NavLink
                key={tool.id}
                to={tool.to}
                className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}
              >
                {tool.title}
              </NavLink>
            )
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link to="/blog" className={`hidden md:inline-flex ${navLinkClass}`}>
            Blog
          </Link>
          <Link to="/guide" className={`hidden lg:inline-flex ${navLinkClass}`}>
            Guides
          </Link>
          <Link to="/about" className={`hidden sm:inline-flex ${navLinkClass}`}>
            About
          </Link>
          <Link to="/contact" className={`hidden sm:inline-flex ${navLinkClass}`}>
            Contact
          </Link>
          <Link
            to="/tools"
            className="inline-flex h-9 items-center rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            All tools
          </Link>
        </div>
      </nav>

      <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
        <Link
          to="/label-crop?platform=flipkart"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
        >
          <ToolIcon name="labelCrop" className="[&>svg]:h-4 [&>svg]:w-4" />
          Flipkart Crop
        </Link>
        <Link
          to="/label-crop?platform=meesho"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
        >
          <ToolIcon name="labelCrop" className="[&>svg]:h-4 [&>svg]:w-4" />
          Meesho Crop
        </Link>
        {TOOLS.filter((tool) => tool.id !== 'label-crop').map((tool) => (
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
