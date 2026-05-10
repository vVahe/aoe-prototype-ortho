'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type B2BBannerProps = {
  practiceName: string;
  city?: string;
  operatorName?: string;
  slug: string;
};

export default function B2BBanner({ practiceName, slug }: B2BBannerProps) {
  const storageKey = `demoBannerDismissed:${slug}`;
  // Start visible; suppress on client if already dismissed
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey) === 'true') setVisible(false);
    } catch {}
  }, [storageKey]);

  function dismiss() {
    try {
      localStorage.setItem(storageKey, 'true');
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="w-full bg-neutral px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
          <p className="text-sm font-semibold text-white">
            Demo gemaakt voor{' '}
            <span className="text-accent">{practiceName}</span>
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Banner sluiten"
          className="shrink-0 rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
