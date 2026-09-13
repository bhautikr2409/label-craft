import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ACCENT, CATEGORIES, TOOLS } from '../../constants/toolsCatalog';
import { SITE_NAME } from '../../constants/site';
import ToolIcon from './ToolIcon';

function ToolCard({ tool }) {
  const accent = ACCENT[tool.accent] || ACCENT.blue;

  const content = (
    <>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.box} ${accent.icon}`}
        >
          <ToolIcon name={tool.icon} />
        </div>
        {tool.available && (
          <span className="mt-1 text-xs font-semibold text-teal-700 opacity-0 transition group-hover:opacity-100">
            Open →
          </span>
        )}
      </div>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h2 className="text-[17px] font-bold text-slate-800">{tool.title}</h2>
        {!tool.available && (
          <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Soon
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-slate-500">{tool.description}</p>
    </>
  );

  const cardClassName = [
    'group relative flex h-full flex-col rounded-2xl border border-slate-100/90 bg-white p-5 text-left transition-all duration-200 sm:p-6',
    tool.available
      ? `hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:shadow-md hover:shadow-teal-900/5 ${accent.hover}`
      : 'opacity-75 cursor-not-allowed',
  ].join(' ');

  if (tool.available && tool.to) {
    return (
      <Link to={tool.to} className={cardClassName} aria-label={`Open ${tool.title}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClassName} aria-disabled="true">
      {content}
    </div>
  );
}

export default function ToolsCatalog({
  showHero = false,
  title = 'All seller label tools',
  subtitle = 'Free shipping-label tools that run in your browser. Pick a tool to get started.',
}) {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      const inCategory = activeCategory === 'all' || tool.category === activeCategory;
      if (!inCategory) return false;
      if (!q) return true;
      return (
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, query]);

  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-[var(--page-bg)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(20,184,166,0.12),_transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          {showHero ? (
            <>
              <p className="mb-3 inline-flex items-center gap-2 rounded-xl border border-teal-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-teal-800 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                Private by design · No uploads
              </p>
              <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl md:text-[2.6rem] md:leading-[1.15]">
                {SITE_NAME} shipping label tools that stay on your device
              </h1>
              <p className="mx-auto max-w-2xl text-base text-slate-500 sm:text-lg">
                Crop Flipkart & Meesho labels, sort Meesho by SKU, inject Amazon SKUs, and add a shop
                logo without sending files to a server.
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
                {title}
              </h1>
              <p className="mx-auto max-w-2xl text-slate-500">{subtitle}</p>
            </>
          )}
        </div>

        <div className="mx-auto mb-6 max-w-xl">
          <label htmlFor="tool-search" className="sr-only">
            Search tools
          </label>
          <div className="relative">
            <svg
              viewBox="0 0 20 20"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.75" />
              <path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            <input
              id="tool-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools — e.g. meesho, amazon, logo…"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/15"
            />
          </div>
        </div>

        <div
          className="mb-8 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Tool categories"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category.id)}
                className={[
                  'rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors',
                  isActive
                    ? 'border-teal-700 bg-teal-700 text-white shadow-sm shadow-teal-700/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-900',
                ].join(' ')}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="mb-4 flex items-center justify-between gap-3 px-1">
          <p className="text-sm text-slate-500">
            {filteredTools.length} tool{filteredTools.length === 1 ? '' : 's'}
            {query.trim() ? ` matching “${query.trim()}”` : ''}
          </p>
          {(query || activeCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActiveCategory('all');
              }}
              className="text-sm font-semibold text-teal-700 hover:text-teal-600"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-6 py-16 text-center">
            <p className="mb-2 text-base font-semibold text-slate-800">No tools found</p>
            <p className="mb-4 text-sm text-slate-500">Try a different search or category.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActiveCategory('all');
              }}
              className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Show all tools
            </button>
          </div>
        )}

        {showHero && (
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: 'Private',
                text: 'Files never leave your browser sandbox.',
              },
              {
                title: 'Fast',
                text: 'No upload wait convert and download instantly.',
              },
              {
                title: 'Free',
                text: 'All tools available without an account.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-teal-100/80 bg-white/80 px-5 py-4 text-left"
              >
                <p className="mb-1 text-sm font-bold text-teal-800">{item.title}</p>
                <p className="text-sm text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
