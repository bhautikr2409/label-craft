import ToolsCatalog from '../components/tools/ToolsCatalog';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME, SITE_URL } from '../constants/site';
import { STATIC_SEO } from '../constants/seoContent';

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      description:
        'Free private shipping-label tools that run entirely in the browser. No file uploads.',
    },
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
  ],
};

export default function LandingPage() {
  const seo = STATIC_SEO.home;

  return (
    <>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
        jsonLd={homeJsonLd}
      />
      <ToolsCatalog showHero />
    </>
  );
}
