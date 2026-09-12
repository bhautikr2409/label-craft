import { GA_MEASUREMENT_ID } from '../constants/site';

export const CONSENT_STORAGE_KEY = 'ecomcrop_cookie_consent_v1';
export const CONSENT_EVENT = 'ecomcrop:cookie-consent';

/** @returns {boolean} */
export function hasAnalyticsConsent() {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === 'accepted';
  } catch {
    return false;
  }
}

export function grantAnalyticsConsent() {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { status: 'accepted' } }));
  }
}

function ensureGtagStub() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

/**
 * Load GA4 (gtag.js) once. Safe to call multiple times.
 * No-ops when VITE_GA_MEASUREMENT_ID / GA_MEASUREMENT_ID is empty.
 */
export function initGoogleAnalytics() {
  if (typeof window === 'undefined') return false;
  if (!GA_MEASUREMENT_ID || !GA_MEASUREMENT_ID.startsWith('G-')) return false;
  if (!hasAnalyticsConsent()) return false;
  if (window.__ecomcropGaReady) {
    return true;
  }

  ensureGtagStub();

  // Consent Mode defaults (granted after banner accept).
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  });

  if (!document.getElementById('ga4-gtag')) {
    const script = document.createElement('script');
    script.id = 'ga4-gtag';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  window.gtag('js', new Date());
  // SPA: we send page_view ourselves on route changes.
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: false,
  });

  window.__ecomcropGaReady = true;
  return true;
}

/**
 * Track a client-side route change as a GA4 page_view.
 * @param {string} path
 * @param {string} [title]
 */
export function trackPageView(path, title = document.title) {
  if (!GA_MEASUREMENT_ID || !hasAnalyticsConsent()) return;
  if (!window.__ecomcropGaReady) {
    initGoogleAnalytics();
  }
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', 'page_view', {
    page_title: title,
    page_path: path,
    page_location: window.location.origin + path,
  });
}

/**
 * Optional custom event helper (tool opens, downloads, etc.).
 * @param {string} name
 * @param {Record<string, string | number | boolean>} [params]
 */
export function trackEvent(name, params = {}) {
  if (!GA_MEASUREMENT_ID || !hasAnalyticsConsent()) return;
  if (!window.__ecomcropGaReady) return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}
