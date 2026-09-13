import { Link, useParams } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME } from '../constants/site';
import { BLOG_POSTS, getBlogPostBySlug } from '../constants/blogContent';
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '../lib/seoJsonLd';
import NotFound from './NotFound';

function toIsoDate(label) {
  const parsed = Date.parse(label);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString();
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return <NotFound />;
  }

  const isoPublished = toIsoDate(post.published);
  const isoUpdated = toIsoDate(post.updated);

  return (
    <StaticPageShell>
      <SeoHead
        title={post.title}
        description={post.description}
        path={post.path}
        keywords={post.keywords}
        ogType="article"
        publishedTime={isoPublished}
        modifiedTime={isoUpdated}
        jsonLd={[
          buildArticleJsonLd({
            headline: post.h1,
            description: post.description,
            path: post.path,
            dateModified: isoUpdated || post.updated,
          }),
          {
            '@context': 'https://schema.org',
            ...buildBreadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Blog', path: '/blog' },
              { name: post.h1, path: post.path },
            ]),
          },
        ]}
      />

      <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <p className="mb-2 text-sm font-semibold text-teal-700">{post.category}</p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {post.h1}
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Published {post.published}
          {post.updated !== post.published ? ` | Updated ${post.updated}` : ''} | {SITE_NAME}
        </p>
        <p className="mb-8 text-base leading-relaxed text-slate-600 sm:text-lg">{post.intro}</p>

        <div className="mb-10">
          <Link
            to={post.toolTo}
            className="inline-flex h-11 items-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-600"
          >
            {post.toolLabel}
          </Link>
        </div>

        <div className="space-y-8">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 text-xl font-bold text-slate-900">{section.heading}</h2>
              <div className="space-y-3 text-[15px] leading-relaxed text-slate-600">
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-10 rounded-2xl border border-teal-100 bg-teal-50/60 px-5 py-6">
          <h2 className="mb-2 text-lg font-bold text-slate-900">More from the blog</h2>
          <ul className="space-y-2">
            {BLOG_POSTS.filter((p) => p.slug !== post.slug).map((p) => (
              <li key={p.slug}>
                <Link to={p.path} className="text-sm font-semibold text-teal-800 hover:underline">
                  {p.h1}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/blog" className="text-sm font-semibold text-teal-800 hover:underline">
                All blog posts
              </Link>
            </li>
            <li>
              <Link to="/guide" className="text-sm font-semibold text-teal-800 hover:underline">
                Help &amp; guides
              </Link>
            </li>
          </ul>
        </aside>
      </article>
    </StaticPageShell>
  );
}
