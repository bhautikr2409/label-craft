import { Helmet } from 'react-helmet-async';
import {
  DEFAULT_OG_IMAGE,
  LANGUAGE,
  LOCALE,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
  absoluteUrl,
} from '../../constants/site';

/**
 * Per-route document head for SEO + social previews.
 * Titles that already include the brand are left unchanged.
 */
export default function SeoHead({
  title,
  description = SITE_DESCRIPTION,
  path = '/',
  keywords = SITE_KEYWORDS,
  noIndex = false,
  ogType = 'website',
  image = DEFAULT_OG_IMAGE,
  imageAlt = OG_IMAGE_ALT,
  jsonLd,
  publishedTime,
  modifiedTime,
}) {
  const canonical = absoluteUrl(path);
  const fullTitle = !title
    ? `${SITE_NAME} — ${SITE_DESCRIPTION.split('.')[0]}`
    : title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;

  const robots = noIndex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const jsonLdBlocks = Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : jsonLd ? [jsonLd] : [];

  return (
    <Helmet prioritizeSeoTags>
      <html lang={LANGUAGE} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      {!noIndex ? <link rel="canonical" href={canonical} /> : null}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="author" content={SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="publisher" content={SITE_NAME} />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta name="format-detection" content="telephone=no" />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={LOCALE} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={noIndex ? SITE_URL : canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta property="og:image:alt" content={imageAlt} />
      {ogType === 'article' && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {ogType === 'article' && modifiedTime ? (
        <meta property="article:modified_time" content={modifiedTime} />
      ) : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />
      {TWITTER_HANDLE ? <meta name="twitter:site" content={TWITTER_HANDLE} /> : null}

      {!noIndex ? (
        <>
          <link rel="alternate" hrefLang={LANGUAGE} href={canonical} />
          <link rel="alternate" hrefLang="x-default" href={canonical} />
        </>
      ) : null}

      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#0f766e" />
      <meta name="color-scheme" content="light" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />

      {jsonLdBlocks.map((block, index) => (
        <script
          // Stable order; content is generated server-side constants, not user HTML.
          key={`jsonld-${index}`}
          type="application/ld+json"
        >
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
