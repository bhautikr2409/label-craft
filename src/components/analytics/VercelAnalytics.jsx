import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { CONSENT_EVENT, hasAnalyticsConsent } from '../../lib/analytics';

/**
 * Vercel Web Analytics — loads only after cookie consent (same gate as GA4).
 */
export default function VercelAnalytics() {
  const [enabled, setEnabled] = useState(() => hasAnalyticsConsent());

  useEffect(() => {
    const sync = () => setEnabled(hasAnalyticsConsent());
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!enabled) return null;

  return <Analytics />;
}
