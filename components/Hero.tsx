'use client';

import { useState } from 'react';
import { UserCircle } from 'lucide-react';
import { PRACTICE_INFO } from '@/lib/constants';

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const [heroFailed, setHeroFailed] = useState(false);

  return (
    <section id="home" className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          {/* Text — always first on mobile, left on desktop */}
          <div className="order-1">
            <h1 className="font-heading mb-4 text-4xl font-bold leading-tight text-primary md:text-5xl">
              De orthodontist in Utrecht voor een rechte lach, op elke leeftijd.
            </h1>
            <p className="mb-8 text-base leading-relaxed text-neutral md:text-lg">
              Of je nu 14 of 44 bent — wij behandelen kinderen én volwassenen met de
              modernste technieken. Inclusief transparante aligners.
            </p>
            <button
              onClick={onOpenBooking}
              className="rounded-full bg-accent px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:scale-105 hover:brightness-90 focus:outline-none focus:ring-4 focus:ring-accent/30"
            >
              Plan een gratis kennismaking
            </button>
            <p className="mt-3 text-sm text-muted">
              Geen wachtlijst · Geen verplichtingen · Antwoord binnen 24 uur
            </p>
          </div>

          {/* Image — below text on mobile, right on desktop */}
          <div className="order-2 flex justify-center md:justify-end">
            <div className="relative h-72 w-full max-w-sm overflow-hidden rounded-2xl shadow-lg md:h-96 md:max-w-none">
              {heroFailed ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-primary/10">
                  <UserCircle className="h-36 w-36 text-primary/30" />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/images/hero.jpg"
                  alt="Rechte tanden na orthodontische behandeling bij De Boog Utrecht"
                  className="h-full w-full object-cover"
                  onError={() => setHeroFailed(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-accent px-4 py-3 md:hidden">
        <span className="text-sm font-semibold text-white truncate pr-2">
          {PRACTICE_INFO.name}
        </span>
        <button
          onClick={onOpenBooking}
          aria-label="Plan een gratis kennismaking"
          className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-accent transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Gratis kennismaking
        </button>
      </div>
    </section>
  );
}
