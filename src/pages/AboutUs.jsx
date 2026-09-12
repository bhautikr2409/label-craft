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
          description: seo.description,
        }}
      />

      <div className="mb-10 text-center sm:mb-12">
        <p className="mb-2 text-sm font-semibold text-teal-700">About us</p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          About {SITE_NAME}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Shipping-label tools for Flipkart, Meesho, and Amazon sellers — processed entirely in your
          browser at {SITE_URL.replace('https://', '')}.
        </p>
      </div>

      <div className="space-y-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-800">Our mission</h2>
          <p className="leading-relaxed text-slate-600">
            Marketplace packing desks should not upload customer names and delivery addresses to
            random online converters. {SITE_NAME} exists so Indian e-commerce sellers can crop
            thermal labels, sort Meesho pages by SKU, stamp Amazon invoice SKUs onto shipping labels,
            and brand packing slips with a shop logo — without sending order PDFs to a server.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-800">Why client-side processing</h2>
          <p className="mb-3 leading-relaxed text-slate-600">
            Shipping labels contain sensitive buyer data. Uploading them to a third-party cloud tool
            creates unnecessary risk and often requires waiting for a queue. {SITE_NAME} runs the
            PDF work in your browser with open client libraries (pdf.js and pdf-lib). When you close
            the tab, the document bytes leave browser memory with it.
          </p>
          <p className="leading-relaxed text-slate-600">
            We do not create accounts for tool use, and we do not store your label files. The only
            information we receive through the website is optional contact-form messages you choose
            to send, plus normal hosting and advertising logs described in our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-800">What you can do on {SITE_NAME}</h2>
          <ul className="list-disc space-y-2 pl-6 leading-relaxed text-slate-600">
            <li>
              <Link to="/label-crop" className="font-semibold text-teal-800 hover:underline">
                Label Crop
              </Link>{' '}
              — Flipkart or Meesho A4 label PDFs into 4×6 thermal-ready pages.
            </li>
            <li>
              <Link to="/meesho-sort" className="font-semibold text-teal-800 hover:underline">
                Sort Meesho Labels
              </Link>{' '}
              — order pages by SKU and courier, then crop for print.
            </li>
            <li>
              <Link to="/amazon-sku" className="font-semibold text-teal-800 hover:underline">
                Amazon SKU Injector
              </Link>{' '}
              — read SKU text from invoice pages and stamp it on shipping labels.
            </li>
            <li>
              <Link to="/add-logo" className="font-semibold text-teal-800 hover:underline">
                Add Logo
              </Link>{' '}
              — place your brand mark in the bottom white space of packing PDFs.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-800">Who we serve</h2>
          <p className="leading-relaxed text-slate-600">
            We built {SITE_NAME} for online sellers and small warehouse teams who print Flipkart,
            Meesho, and Amazon labels every day. If you need a private, free browser workflow without
            installing desktop software, these tools are for you. New sellers can follow our{' '}
            <Link to="/guide" className="font-semibold text-teal-800 hover:underline">
              Help Guide
            </Link>{' '}
            and in-depth packing articles under Guides.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-800">Advertising &amp; contact</h2>
          <p className="mb-3 leading-relaxed text-slate-600">
            {SITE_NAME} is free to use. The site may display Google AdSense ads to support hosting
            and development. Ads never receive the contents of PDFs you process. Cookie details and
            opt-out links are published in our{' '}
            <Link to="/privacy" className="font-semibold text-teal-800 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p className="leading-relaxed text-slate-600">
            Questions, feedback, or print issues? Reach us on the{' '}
            <Link to="/contact" className="font-semibold text-teal-800 hover:underline">
              contact page
            </Link>
            . We reply by email.
          </p>
        </section>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
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
