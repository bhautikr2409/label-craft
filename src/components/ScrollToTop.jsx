import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Smooth-scroll to top whenever the route changes (footer / nav / tool links). */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = reduceMotion ? 'auto' : 'smooth';

    if (hash) {
      const id = hash.replace('#', '');
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior, block: 'start' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior });
        }
      });
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior });
    });
  }, [pathname, search, hash]);

  return null;
}
