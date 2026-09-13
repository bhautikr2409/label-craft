import { Link } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME } from '../constants/site';
import { STATIC_SEO } from '../constants/seoContent';
import { BLOG_POSTS } from '../constants/blogContent';

export default function Blog() {
  const seo = STATIC_SEO.blog;

  return (
    <StaticPageShell>
      <SeoHead title={seo.title} description={seo.description} path={seo.path} keywords={seo.keywords} />

      <div className="mb-10 text-center sm:mb-12">
        <p className="mb-2 text-sm font-semibold text-teal-700">Blog</p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Seller tips from {SITE_NAME}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Practical posts on thermal printing, packing workflows, and private label tools - written
          for Flipkart, Meesho, and Amazon sellers.
        </p>
      </div>

      <ul className="space-y-4">
        {BLOG_POSTS.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.path}
              className="block rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-teal-200 sm:p-8"
            >
              <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
                <span>{post.category}</span>
                <span className="text-slate-300"> | </span>
                <span className="normal-case tracking-normal text-slate-500">{post.published}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{post.h1}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                {post.description}
              </p>
              <span className="mt-4 inline-flex text-sm font-semibold text-teal-800">
                Read article
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-center text-sm text-slate-500">
        Need step-by-step tool help?{' '}
        <Link to="/guide" className="font-semibold text-teal-700 hover:underline">
          Open Help &amp; Guides
        </Link>
      </p>
    </StaticPageShell>
  );
}
