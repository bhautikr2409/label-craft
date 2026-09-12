import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GA_MEASUREMENT_ID } from '../../constants/site';
import {
  CONSENT_EVENT,
  hasAnalyticsConsent,
  initGoogleAnalytics,
  trackPageView,
} from '../../lib/analytics';

/**
 * Loads GA4 after cookie consent and sends page_view on every React Router navigation.
 */
export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return undefined;

    const boot = () => {
      if (hasAnalyticsConsent()) {
        initGoogleAnalytics();
      }
    };

    boot();
    window.addEventListener(CONSENT_EVENT, boot);
    return () => window.removeEventListener(CONSENT_EVENT, boot);
  }, []);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !hasAnalyticsConsent()) return;

    const path = `${location.pathname}${location.search}`;
    // Defer so document.title from SeoHead/Helmet can settle.
    const id = window.setTimeout(() => {
      trackPageView(path, document.title);
    }, 0);

    return () => window.clearTimeout(id);
  }, [location.pathname, location.search]);

  return null;
}
