/** Canonical site identity for SEO and branding. */
export const SITE_NAME = "EcomCrop";
export const SITE_LEGAL_NAME = "EcomCrop";
export const SITE_DOMAIN = "ecomcrop.in";
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const SITE_TAGLINE =
  "Free private shipping-label tools for marketplace sellers";
export const SITE_DESCRIPTION =
  "EcomCrop is a free browser-based toolkit for Flipkart, Meesho, and Amazon shipping labels. Crop, sort, add logos, and inject SKUs — files never leave your device.";
export const SITE_KEYWORDS =
  "ecomcrop, shipping label crop, flipkart label, meesho label, amazon sku, thermal printer pdf, 4x6 label";

/** Absolute asset URLs used in Open Graph / JSON-LD. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/img/og-cover.png`;
export const SITE_LOGO_URL = `${SITE_URL}/img/ecomcrop-icon.png`;
export const SITE_FAVICON_URL = `${SITE_URL}/favicon.svg`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT = `${SITE_NAME} — free private shipping-label tools`;

export const TWITTER_HANDLE = "";
export const CONTACT_PATH = "/contact";
export const LOCALE = "en_US";
export const LANGUAGE = "en";

/**
 * Google Analytics 4 Measurement ID (G-XXXXXXXX).
 * Set in `.env` as GA_MEASUREMENT_ID=G-XXXXXXXXXX then restart `npm run dev`.
 * Leave empty to disable analytics in local/dev until configured.
 */
export const GA_MEASUREMENT_ID = String(
  import.meta.env.GA_MEASUREMENT_ID || "",
).trim();

/** Build a canonical absolute URL for a site path. */
export function absoluteUrl(path = "/") {
  const origin = SITE_URL.replace(/\/$/, "");
  if (!path || path === "/") return `${origin}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}
