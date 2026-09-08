import { Link } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME, SITE_URL } from '../constants/site';
import { STATIC_SEO } from '../constants/seoContent';

export default function TermsOfService() {
  const seo = STATIC_SEO.terms;

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
          Terms of Service
        </h1>
        <p className="mb-8 text-sm text-slate-500">
          Last updated: August 8, 2026 · Website: {SITE_URL.replace('https://', '')}
        </p>

        <div className="space-y-8 leading-relaxed text-slate-700">
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">1. Agreement to terms</h2>
            <p>
              By accessing {SITE_NAME} at {SITE_URL}, you agree to these Terms of Service. If you do
              not agree, do not use the website or tools.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">2. Description of service</h2>
            <p>
              {SITE_NAME} provides free, browser-based PDF utilities (including merge, split,
              compress, crop, convert, edit, organize, protect, and unlock). Document processing
              happens client-side via JavaScript. Files are not uploaded, processed, or stored on our
              servers for tool operations.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">3. Acceptable use</h2>
            <p className="mb-3">Use {SITE_NAME} only for lawful purposes. You must not:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Process files that contain malware or harmful code.</li>
              <li>Attempt to disrupt or compromise the integrity of the application.</li>
              <li>Use automated scraping or bots against the interface without permission.</li>
              <li>Use Unlock PDF on documents you are not authorized to open.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">4. Intellectual property</h2>
            <p>
              Software, designs, branding, and icons are the property of {SITE_NAME} and its
              creators. You receive a limited, non-exclusive license to use the tools for personal or
              commercial PDF work. You retain all rights to your own documents.
            </p>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 sm:p-6">
            <h2 className="mb-2 text-xl font-bold text-amber-950">5. Disclaimer of warranties</h2>
            <p className="text-amber-950">
              {SITE_NAME} is provided “as is” without warranties of any kind. We do not guarantee
              uninterrupted service or compatibility with every PDF. You are responsible for
              verifying output quality before relying on a file.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">6. Limitation of liability</h2>
            <p>
              {SITE_NAME} and its contributors are not liable for damages arising from use of the
              tools, including data loss or document corruption, to the fullest extent permitted by
              law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">7. Advertising</h2>
            <p>
              The site may display third-party advertisements (including Google AdSense). Ad content
              is provided by third parties; we are not responsible for advertiser offers. See our{' '}
              <Link to="/privacy" className="font-medium text-teal-700 hover:underline">
                Privacy Policy
              </Link>{' '}
              for cookie details.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">8. Changes to terms</h2>
            <p>
              We may update these terms at any time. Continued use after changes means you accept the
              revised terms. The “Last updated” date at the top will change when we revise this page.
            </p>
          </section>
        </div>
      </div>
    </StaticPageShell>
  );
}
