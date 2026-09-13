import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GA_MEASUREMENT_ID } from '../../constants/site';
import {
  CONSENT_EVENT,
  hasAnalyticsConsent,
  initGoogleAnalytics,
  trackPageView,
  trackToolOpen,
} from '../../lib/analytics';

const TOOL_ROUTES = {
  '/label-crop': 'label-crop',
  '/meesho-sort': 'meesho-sort',
  '/amazon-sku': 'amazon-sku',
  '/add-logo': 'add-logo',
};

/**
 * Loads GA4 after cookie consent and sends page_view on every React Router navigation.
 * Also fires tool_open when a seller tool route is opened.
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
    const toolId = TOOL_ROUTES[location.pathname];

    const id = window.setTimeout(() => {
      trackPageView(path, document.title);
      if (toolId) trackToolOpen(toolId);
    }, 0);

    return () => window.clearTimeout(id);
  }, [location.pathname, location.search]);

  return null;
}
