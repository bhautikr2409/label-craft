import { Link } from 'react-router-dom';
import ToolsCatalog from '../components/tools/ToolsCatalog';
import SeoHead from '../components/seo/SeoHead';
import { TOOLS } from '../constants/toolsCatalog';
import { SITE_NAME, SITE_URL } from '../constants/site';
import { STATIC_SEO } from '../constants/seoContent';

const toolsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: `All seller tools — ${SITE_NAME}`,
  url: `${SITE_URL}/tools`,
  isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: TOOLS.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.title,
      url: `${SITE_URL}${tool.to}`,
      description: tool.description,
    })),
  },
};

export default function Tools() {
  const seo = STATIC_SEO.tools;

  return (
    <>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
        jsonLd={toolsJsonLd}
      />
      <ToolsCatalog
        title="All seller label tools"
        subtitle="Free, client-side shipping-label utilities. Your files never leave your browser."
      />
      <section className="border-t border-slate-200/80 bg-[var(--page-bg)]">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">How to choose a tool</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
            Use{' '}
            <Link to="/label-crop" className="font-semibold text-teal-800 hover:underline">
              Label Crop
            </Link>{' '}
            for Flipkart or Meesho A4 → 4×6 thermal print.{' '}
            <Link to="/meesho-sort" className="font-semibold text-teal-800 hover:underline">
              Sort Meesho Labels
            </Link>{' '}
            when you need SKU + courier order.{' '}
            <Link to="/amazon-sku" className="font-semibold text-teal-800 hover:underline">
              Amazon SKU Injector
            </Link>{' '}
            stamps invoice SKUs onto Amazon shipping labels.{' '}
            <Link to="/add-logo" className="font-semibold text-teal-800 hover:underline">
              Add Logo
            </Link>{' '}
            brands the empty band on packing slips.
          </p>
        </div>
      </section>
    </>
  );
}
