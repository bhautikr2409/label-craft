import { Link } from 'react-router-dom';
import ToolsCatalog from '../components/tools/ToolsCatalog';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME } from '../constants/site';
import { STATIC_SEO } from '../constants/seoContent';
import { GUIDES } from '../constants/guidesContent';
import { buildHomeJsonLd } from '../lib/seoJsonLd';

export default function LandingPage() {
  const seo = STATIC_SEO.home;

  return (
    <>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
        jsonLd={buildHomeJsonLd()}
      />
      <ToolsCatalog showHero />

      <section className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Built for marketplace packing desks
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 sm:text-base">
            {SITE_NAME} helps Flipkart, Meesho, and Amazon sellers prepare shipping labels for
            thermal printers without uploading order PDFs. Crop A4 marketplace sheets to 4×6, sort
            Meesho pages by SKU, stamp invoice SKUs onto Amazon labels, and place your shop logo in
            empty packing space — all in the browser on your packing laptop.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 sm:text-base">
            Customer names and addresses stay on your device. We do not require an account to use
            the tools. Read how each workflow works in our{' '}
            <Link to="/guide" className="font-semibold text-teal-800 hover:underline">
              Help Guide
            </Link>{' '}
            or the packing articles below.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-[var(--page-bg)]">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            How private processing works
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 sm:text-base">
            When you choose a PDF, {SITE_NAME} reads it with JavaScript libraries running in your
            tab. Cropping, sorting, and SKU text extraction happen in memory. Closing the tab clears
            that session. The contact form is the only place we receive a message you deliberately
            send. Details are in our{' '}
            <Link to="/privacy" className="font-semibold text-teal-800 hover:underline">
              Privacy Policy
            </Link>
            , including how Google AdSense cookies may work if ads are shown.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Packing guides
          </h2>
          <ul className="space-y-4">
            {GUIDES.map((guide) => (
              <li key={guide.slug}>
                <Link
                  to={guide.path}
                  className="block rounded-2xl border border-slate-100 bg-[var(--page-bg)] px-5 py-4 transition hover:border-teal-200"
                >
                  <span className="text-base font-bold text-slate-900">{guide.h1}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    {guide.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-slate-500">
            New here? Start with{' '}
            <Link to="/about" className="font-semibold text-teal-800 hover:underline">
              About {SITE_NAME}
            </Link>{' '}
            or{' '}
            <Link to="/contact" className="font-semibold text-teal-800 hover:underline">
              Contact
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
