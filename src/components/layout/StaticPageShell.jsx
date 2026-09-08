/**
 * Shared layout chrome for content pages (About, Guide, legal, etc.).
 */
export default function StaticPageShell({ children, narrow = false }) {
  return (
    <div className="min-h-[70vh] bg-[var(--page-bg)] py-12 px-4 sm:px-6 sm:py-16">
      <div className={`mx-auto ${narrow ? 'max-w-xl' : 'max-w-4xl'}`}>{children}</div>
    </div>
  );
}
