'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type B2BBannerProps = {
  practiceName: string;
  slug: string;
};

export default function B2BBanner({ practiceName, slug }: B2BBannerProps) {
  const storageKey = `demoBannerDismissed:${slug}`;
  const [visible, setVisible] = useState(true);
  const [dismissing, setDismissing] = useState(false);
  const [vahecoHref, setVahecoHref] = useState('https://vaheco.nl');

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey) === 'true') setVisible(false);
    } catch {}
    if (window.location.hostname === 'localhost') setVahecoHref('http://localhost:3000');
  }, [storageKey]);

  function dismiss() {
    setDismissing(true);
  }

  function handleAnimationEnd() {
    if (dismissing) {
      try {
        localStorage.setItem(storageKey, 'true');
      } catch {}
      setVisible(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      className={`w-full bg-neutral px-4 py-3 ${dismissing ? 'animate-banner-dismiss' : ''}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex-1" />
        <p className="text-center text-sm font-semibold text-white">
          Demo gemaakt voor{' '}
          <span className="text-accent">{practiceName}</span>
          {' '}- gemaakt door{' '}
          <a
            href={vahecoHref}
            className="text-accent underline hover:opacity-80 transition-opacity"
          >
            VAHECO
          </a>
        </p>
        <div className="flex flex-1 justify-end">
          <button
            onClick={dismiss}
            aria-label="Banner sluiten"
            className="shrink-0 rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
