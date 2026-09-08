import { Link } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME } from '../constants/site';
import { STATIC_SEO, TOOL_SEO } from '../constants/seoContent';
import { TOOLS } from '../constants/toolsCatalog';

const guideTopics = [
  {
    id: 'label-crop',
    title: 'Label Crop',
    steps: [
      'Open Label Crop and select Flipkart or Meesho.',
      'Upload your marketplace label PDF.',
      'Download the thermal-ready cropped PDF.',
    ],
  },
  {
    id: 'meesho-sort',
    title: 'Sort Meesho Labels',
    steps: [
      'Add one or more Meesho label PDFs.',
      'Choose output size if prompted.',
      'Run Sort, Crop & Download.',
    ],
  },
  {
    id: 'amazon-sku',
    title: 'Amazon SKU Injector',
    steps: [
      'Upload an Amazon PDF with label + invoice page pairs.',
      'The tool extracts SKU from each even (invoice) page.',
      'Download a PDF with SKU stamped on each odd (label) page.',
    ],
  },
  {
    id: 'add-logo',
    title: 'Add Logo to PDF',
    steps: [
      'Upload the PDF, then your logo image.',
      'Confirm placement in the preview.',
      'Download the branded multi-page PDF.',
    ],
  },
];

export default function Guide() {
  const seo = STATIC_SEO.guide;

  return (
    <StaticPageShell>
      <SeoHead title={seo.title} description={seo.description} path={seo.path} keywords={seo.keywords} />

      <div className="mb-10 text-center sm:mb-12">
        <p className="mb-2 text-sm font-semibold text-teal-700">Help & guide</p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          How to use {SITE_NAME}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Step-by-step packing workflows. Files stay in your browser.
        </p>
      </div>

      <div className="mb-8 space-y-6">
        {guideTopics.map((topic) => {
          const tool = TOOLS.find((t) => t.id === topic.id);
          const toolSeo = TOOL_SEO[topic.id];
          return (
            <article
              key={topic.id}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <h2 className="text-2xl font-bold text-slate-900">{topic.title}</h2>
                {tool ? (
                  <Link to={tool.to} className="text-sm font-semibold text-teal-700 hover:underline">
                    Open {topic.title} →
                  </Link>
                ) : null}
              </div>
              {toolSeo ? (
                <p className="mb-5 text-sm leading-relaxed text-slate-600">{toolSeo.intro}</p>
              ) : null}
              <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {topic.steps.map((text, i) => (
                  <li key={text} className="rounded-xl bg-[var(--page-bg)] p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-sm font-bold text-teal-800">
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700">{text}</p>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>
    </StaticPageShell>
  );
}
