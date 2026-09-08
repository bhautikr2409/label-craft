import { Link } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME, SITE_URL } from '../constants/site';
import { STATIC_SEO } from '../constants/seoContent';

export default function AboutUs() {
  const seo = STATIC_SEO.about;

  return (
    <StaticPageShell>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: seo.title,
          url: `${SITE_URL}/about`,
        }}
      />

      <div className="mb-10 text-center sm:mb-12">
        <p className="mb-2 text-sm font-semibold text-teal-700">About us</p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          About {SITE_NAME}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Shipping-label tools for Flipkart, Meesho, and Amazon sellers — processed entirely in your
          browser.
        </p>
      </div>

      <div className="space-y-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-800">Our mission</h2>
          <p className="leading-relaxed text-slate-600">
            Marketplace packing desks should not upload customer addresses to random converters.{' '}
            {SITE_NAME} crops thermal labels, sorts Meesho pages by SKU, injects Amazon SKUs, and
            stamps shop logos locally so order data never leaves the device.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-800">Who we serve</h2>
          <p className="leading-relaxed text-slate-600">
            Online sellers who print 4×6 labels every day and need a private, free browser workflow
            without installing desktop software.
          </p>
        </section>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center rounded-xl bg-teal-700 px-6 text-sm font-semibold text-white hover:bg-teal-600"
          >
            Browse tools
          </Link>
          <Link
            to="/contact"
            className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700"
          >
            Contact us
          </Link>
        </div>
      </div>
    </StaticPageShell>
  );
}
