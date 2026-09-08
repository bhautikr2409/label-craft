const PLATFORMS = [
  {
    id: 'flipkart',
    label: 'Flipkart',
    description:
      'Crops the top shipping label only and trims to the black border. Tax invoice below is removed.',
    accent: 'orange',
  },
  {
    id: 'meesho',
    label: 'Meesho',
    description:
      'Crops from the top (no invoice body), rotates 90°, then downloads for 4×6 thermal print.',
    accent: 'rose',
  },
];

const ACCENT = {
  orange: {
    ring: 'hover:border-orange-400 focus-visible:ring-orange-500',
    icon: 'bg-orange-50 text-orange-600',
    badge: 'text-orange-700',
  },
  rose: {
    ring: 'hover:border-rose-400 focus-visible:ring-rose-500',
    icon: 'bg-rose-50 text-rose-600',
    badge: 'text-rose-700',
  },
};

export default function LabelCropPlatformPicker({ onSelect }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-8 sm:px-8">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">Which label do you want to crop?</h2>
        <p className="mt-2 text-sm text-slate-500">
          Choose Flipkart or Meesho first, then upload your label PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PLATFORMS.map((platform) => {
          const accent = ACCENT[platform.accent];
          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => onSelect(platform.id)}
              className={[
                'group flex flex-col rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition',
                'hover:-translate-y-0.5 hover:bg-slate-50/60 focus-visible:outline-none focus-visible:ring-2',
                accent.ring,
              ].join(' ')}
            >
              <span
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${accent.icon}`}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                  <rect
                    x="4"
                    y="3"
                    width="12"
                    height="16"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  />
                  <path
                    d="M7 8h6M7 11h6M7 14h4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 13h5v7H9v-3"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className={`text-lg font-bold text-slate-900 ${accent.badge}`}>
                {platform.label}
              </span>
              <span className="mt-2 text-sm leading-relaxed text-slate-500">
                {platform.description}
              </span>
              <span className="mt-4 text-sm font-semibold text-slate-700 group-hover:text-rose-700">
                Continue →
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
