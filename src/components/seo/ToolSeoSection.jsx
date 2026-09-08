import { Link } from 'react-router-dom';
import { TOOLS } from '../../constants/toolsCatalog';
import { SITE_NAME, SITE_URL } from '../../constants/site';
import { getToolSeo } from '../../constants/seoContent';
import SeoHead from './SeoHead';

function buildToolJsonLd(seo) {
  const faqEntities = (seo.faqs || []).map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `${seo.h1} — ${SITE_NAME}`,
        url: `${SITE_URL}${seo.path}`,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any (modern browser)',
        browserRequirements: 'Requires JavaScript',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: seo.description,
        provider: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tools',
            item: `${SITE_URL}/tools`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: seo.h1,
            item: `${SITE_URL}${seo.path}`,
          },
        ],
      },
      faqEntities.length
        ? {
            '@type': 'FAQPage',
            mainEntity: faqEntities,
          }
        : null,
    ].filter(Boolean),
  };
}

/**
 * AdSense-oriented article + FAQ + internal links for a tool page.
 * Also injects the page <SeoHead> + JSON-LD.
 */
export default function ToolSeoSection({ toolId, accentClass = 'text-teal-700' }) {
  const seo = getToolSeo(toolId);
  if (!seo) return null;

  const relatedTools = (seo.related || [])
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
        jsonLd={buildToolJsonLd(seo)}
      />

      <article className="mt-12 space-y-8 border-t border-slate-200 pt-10 text-left">
        <header>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            About this {SITE_NAME} tool
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">{seo.intro}</p>
        </header>

        {(seo.sections || []).map((section) => (
          <section key={section.heading}>
            <h3 className="mb-3 text-xl font-bold text-slate-900">{section.heading}</h3>
            <div className="space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 sm:px-8">
          <h3 className="mb-5 text-xl font-bold text-slate-900">
            Frequently asked questions
          </h3>
          <div className="space-y-5">
            {(seo.faqs || []).map((faq) => (
              <div key={faq.q} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                <h4 className="mb-2 text-base font-semibold text-slate-800">{faq.q}</h4>
                <p className="text-sm leading-relaxed text-slate-600 sm:text-[15px]">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-teal-100 bg-teal-50/50 px-5 py-6 sm:px-8">
          <h3 className="mb-2 text-lg font-bold text-slate-900">Privacy promise</h3>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            {SITE_NAME} processes this file type entirely in your browser. Documents are not
            uploaded to our servers for merge, split, compress, crop, convert, or security tools.
            Closing the tab clears in-memory data. Read our{' '}
            <Link to="/privacy" className={`font-semibold ${accentClass} hover:underline`}>
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link to="/guide" className={`font-semibold ${accentClass} hover:underline`}>
              Help Guide
            </Link>
            .
          </p>
        </section>

        {relatedTools.length > 0 ? (
          <section>
            <h3 className="mb-4 text-lg font-bold text-slate-900">Related seller tools</h3>
            <ul className="flex flex-wrap gap-2">
              {relatedTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    to={tool.to}
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-800"
                  >
                    {tool.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/tools"
                  className="inline-flex items-center rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
                >
                  All tools
                </Link>
              </li>
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}
