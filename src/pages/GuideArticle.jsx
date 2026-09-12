import { Link, useParams } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME } from '../constants/site';
import { GUIDES, getGuideBySlug } from '../constants/guidesContent';
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '../lib/seoJsonLd';
import NotFound from './NotFound';

function toIsoDate(label) {
  // Guides store "September 12, 2026" — convert for article meta when possible.
  const parsed = Date.parse(label);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString();
}

export default function GuideArticle() {
  const { slug } = useParams();
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return <NotFound />;
  }

  const isoDate = toIsoDate(guide.updated);

  return (
    <StaticPageShell>
      <SeoHead
        title={guide.title}
        description={guide.description}
        path={guide.path}
        keywords={guide.keywords}
        ogType="article"
        publishedTime={isoDate}
        modifiedTime={isoDate}
        jsonLd={[
          buildArticleJsonLd({
            headline: guide.h1,
            description: guide.description,
            path: guide.path,
            dateModified: isoDate || guide.updated,
          }),
          {
            '@context': 'https://schema.org',
            ...buildBreadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Guides', path: '/guide' },
              { name: guide.h1, path: guide.path },
            ]),
          },
        ]}
      />

      <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <p className="mb-2 text-sm font-semibold text-teal-700">Seller packing guide</p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {guide.h1}
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Updated {guide.updated} · {SITE_NAME}
        </p>
        <p className="mb-8 text-base leading-relaxed text-slate-600 sm:text-lg">{guide.intro}</p>

        <div className="mb-10">
          <Link
            to={guide.toolTo}
            className="inline-flex h-11 items-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-600"
          >
            {guide.toolLabel}
          </Link>
        </div>

        <div className="space-y-8">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 text-xl font-bold text-slate-900">{section.heading}</h2>
              <div className="space-y-3 text-[15px] leading-relaxed text-slate-600">
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-10 rounded-2xl border border-teal-100 bg-teal-50/60 px-5 py-6">
          <h2 className="mb-2 text-lg font-bold text-slate-900">More packing guides</h2>
          <ul className="space-y-2">
            {GUIDES.filter((g) => g.slug !== guide.slug).map((g) => (
              <li key={g.slug}>
                <Link to={g.path} className="text-sm font-semibold text-teal-800 hover:underline">
                  {g.h1}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/guide" className="text-sm font-semibold text-teal-800 hover:underline">
                All help &amp; guides
              </Link>
            </li>
          </ul>
        </aside>
      </article>
    </StaticPageShell>
  );
}
