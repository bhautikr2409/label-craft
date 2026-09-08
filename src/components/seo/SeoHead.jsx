import { Helmet } from 'react-helmet-async';
import {
  DEFAULT_OG_IMAGE,
  LOCALE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '../../constants/site';
import { absoluteUrl } from '../../constants/seoContent';

/**
 * Per-route document head for SEO + social previews.
 * Titles that already include the brand are left unchanged.
 */
export default function SeoHead({
  title,
  description = SITE_DESCRIPTION,
  path = '/',
  keywords,
  noIndex = false,
  ogType = 'website',
  image = DEFAULT_OG_IMAGE,
  imageAlt = `${SITE_NAME} — free private PDF tools`,
  jsonLd,
}) {
  const canonical = absoluteUrl(path);
  const fullTitle = !title
    ? SITE_NAME
    : title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;

  const robots = noIndex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1';

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      {!noIndex ? <link rel="canonical" href={canonical} /> : null}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="author" content={SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={LOCALE} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={noIndex ? SITE_URL : canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {!noIndex ? (
        <>
          <link rel="alternate" hrefLang="en" href={canonical} />
          <link rel="alternate" hrefLang="x-default" href={canonical} />
        </>
      ) : null}

      <meta name="theme-color" content="#0f766e" />
      <meta name="color-scheme" content="light" />

      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  );
}
