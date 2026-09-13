import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SITE_NAME } from '../../constants/site';
import {
  CONSENT_STORAGE_KEY,
  grantAnalyticsConsent,
  hasAnalyticsConsent,
  initGoogleAnalytics,
} from '../../lib/analytics';

/**
 * Consent banner for analytics / AdSense cookies.
 * GA4 loads only after the visitor accepts (or already accepted previously).
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_STORAGE_KEY)) {
        setVisible(true);
      } else if (hasAnalyticsConsent()) {
        initGoogleAnalytics();
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    grantAnalyticsConsent();
    initGoogleAnalytics();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      data-cookie-consent
      role="dialog"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-slate-200 bg-white/95 p-4 backdrop-blur sm:p-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-slate-600">
          {SITE_NAME} uses cookies for essential site functions, Google Analytics (traffic
          measurement), and may use Google AdSense cookies to show ads. PDF files you process stay
          in your browser and are never uploaded.{' '}
          <Link to="/privacy" className="font-semibold text-teal-700 hover:underline">
            Privacy Policy
          </Link>
          {' · '}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal-700 hover:underline"
          >
            Ad settings
          </a>
        </p>
        <button
          type="button"
          onClick={accept}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-600"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
