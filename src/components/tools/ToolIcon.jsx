const iconClass = 'w-7 h-7';

const ICONS = {
  merge: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="3" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  split: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="3" y="3" width="7" height="18" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="18" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
    </svg>
  ),
  compress: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="6" y="3" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M9 8h6M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 17v4M9.5 19.5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  crop: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <path d="M6 2v4M18 2v4M4 8h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  labelCrop: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="4" y="3" width="11" height="18" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M7 7h5M7 10h5M7 13h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="12" y="10" width="8" height="11" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M14 13h4M14 16h4M14 19h2.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  meeshoSort: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="4" y="3" width="10" height="18" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M7 7h4M7 10h4M7 13h2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M16 7v10M13.5 9.5L16 7l2.5 2.5M13.5 14.5L16 17l2.5-2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  addLogo: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="4" y="3" width="12" height="18" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="9" y="15.5" width="6" height="3.5" rx="0.75" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="18" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M18 6.5v3M16.5 8h3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  amazonSku: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="4" y="3" width="10" height="18" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M7 7h4M7 10h4M7 13h2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 8l4 4m0-4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="13" y="14" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.75" />
      <path d="M15 17h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <path d="M4 20h4L18 10l-4-4L4 16v4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13 7l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  rotate: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="7" y="6" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M17 8a7 7 0 11-2.5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14.5 2.5l2 1.2-1.2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pdfToImage: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="3" y="4" width="10" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="11" y="8" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="14" cy="11" r="1.2" fill="currentColor" />
      <path d="M12 16l2.5-2.5L16 15l2-2.5 2 3.5H12z" fill="currentColor" opacity="0.35" />
    </svg>
  ),
  imageToPdf: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path d="M5 16l4-4 3 3 2-2 4 3H5z" fill="currentColor" opacity="0.35" />
    </svg>
  ),
  markdown: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="4" y="4" width="11" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M7 9h5M7 12h5M7 15h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 12l4 6H15l1-2.5 1-1.5 1-2h2.5L18 18z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  markdownToPdf: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <path
        d="M5 4h9l5 5v11a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M14 4v5h5M8 12h5M8 15h8M8 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  protect: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
    </svg>
  ),
  unlock: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 017-2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
    </svg>
  ),
  compare: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="3" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M7 9h2M7 12h2M7 15h1M15 9h2M15 12h2M15 15h1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  organize: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="5" y="3" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M8 7h4M8 10h4M8 13h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M17 8v8M13 12h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export default function ToolIcon({ name, className = '' }) {
  return <span className={`inline-flex ${className}`}>{ICONS[name] || ICONS.merge}</span>;
}
