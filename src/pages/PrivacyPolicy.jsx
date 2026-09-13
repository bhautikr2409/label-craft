import { Link } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME, SITE_URL } from '../constants/site';
import { STATIC_SEO } from '../constants/seoContent';
import { CONTACT_EMAIL } from '../constants';

export default function PrivacyPolicy() {
  const seo = STATIC_SEO.privacy;

  return (
    <StaticPageShell>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
      />

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <p className="mb-2 text-sm font-semibold text-teal-700">Legal</p>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mb-8 text-sm text-slate-500">
          Last updated: September 12, 2026 · Website: {SITE_URL.replace('https://', '')}
        </p>

        <div className="space-y-8 leading-relaxed text-slate-700">
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">1. Introduction</h2>
            <p>
              Welcome to {SITE_NAME} ({SITE_URL}). We value your privacy and are committed to
              protecting your personal data. This policy explains how we collect, use, and protect
              information when you use our client-side shipping-label tools.
            </p>
          </section>

          <section className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 sm:p-6">
            <h2 className="mb-2 text-xl font-bold text-teal-900">2. Zero-server file privacy</h2>
            <p className="font-medium text-teal-950">
              Shipping-label PDFs and logo images you process are handled locally on your device
              with client-side libraries. Files are never uploaded to our servers, storage, or
              databases for processing. Closing the tab or choosing a new file clears documents from
              browser memory.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">3. Information we collect</h2>
            <p className="mb-3">We collect minimal information to operate the site:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Usage data:</strong> pages visited, approximate tool interactions, and
                performance metrics (via hosting or analytics providers when enabled).
              </li>
              <li>
                <strong>Device data:</strong> IP address, browser, OS, and language preferences as
                provided by standard web logs.
              </li>
              <li>
                <strong>Contact form data:</strong> name, email, and message content you voluntarily
                send via the contact page.
              </li>
              <li>
                <strong>Cookies:</strong> identifiers used for essential preferences, Google
                Analytics, Vercel Analytics, and advertising partners such as Google AdSense.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">4. Google Analytics</h2>
            <p className="mb-3">
              {SITE_NAME} may use Google Analytics 4 to understand aggregated traffic (pages viewed,
              approximate location, device/browser type, and referral sources). Analytics cookies
              load after you accept the cookie notice. We configure Analytics with IP anonymization
              where supported. Google may process this data as described in{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-700 hover:underline"
              >
                Google&apos;s Privacy Policy
              </a>
              . You can limit Analytics via browser controls or Google&apos;s{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-700 hover:underline"
              >
                Analytics opt-out browser add-on
              </a>
              .
            </p>
            <p className="mb-3">
              Analytics does <strong>not</strong> receive the contents of shipping-label PDFs or
              logos you process in the tools.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">5. Vercel Analytics</h2>
            <p className="mb-3">
              When you accept the cookie notice, {SITE_NAME} may also use Vercel Web Analytics to
              collect aggregated page-view and visitor metrics for the hosted site. This does{' '}
              <strong>not</strong> include shipping-label PDF contents. See{' '}
              <a
                href="https://vercel.com/docs/analytics/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-700 hover:underline"
              >
                Vercel&apos;s Analytics privacy documentation
              </a>{' '}
              for details.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">6. Google AdSense & cookies</h2>
            <p className="mb-3">
              This site may use Google AdSense to display advertisements. Third-party vendors,
              including Google, use cookies to serve ads based on your prior visits to this and other
              websites. Google&apos;s use of advertising cookies enables it and its partners to serve
              ads based on your visit to {SITE_NAME} and/or other sites on the Internet.
            </p>
            <p className="mb-3">
              Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-700 hover:underline"
              >
                Google Ad Settings
              </a>
              . Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for
              personalized advertising by visiting{' '}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-700 hover:underline"
              >
                www.aboutads.info
              </a>
              .
            </p>
            <p>
              Ad partners do not receive the contents of PDFs you process in {SITE_NAME}. Document
              bytes remain in your browser.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">7. Data security</h2>
            <p>
              Because documents stay on your machine, they are not exposed through server
              transmission for processing. Site traffic uses HTTPS/TLS. No method of transmission
              over the Internet is 100% secure; we follow reasonable practices for the website
              itself.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">8. Children&apos;s privacy</h2>
            <p>
              {SITE_NAME} is not directed at children under 13. We do not knowingly collect personal
              information from children.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">9. Your rights</h2>
            <p>
              Depending on your location, you may have rights to access or delete analytical or
              contact data we hold. We do not store your PDF files, so there is no document data to
              retrieve or delete from our servers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">10. Contact</h2>
            <p>
              Questions about this policy? Email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-teal-700 hover:underline">
                {CONTACT_EMAIL}
              </a>{' '}
              or visit our{' '}
              <Link to="/contact" className="font-medium text-teal-700 hover:underline">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </StaticPageShell>
  );
}
