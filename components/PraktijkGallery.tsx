'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  photos: string[];
  city: string;
}

export default function PraktijkGallery({ photos, city }: Props) {
  const [failed, setFailed]     = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [visible, setVisible]   = useState(false);

  // Trigger open animation after the overlay mounts
  useEffect(() => {
    if (selected) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
  }, [selected]);

  const openPhoto = (src: string) => {
    setSelected(src);
  };

  const closePhoto = () => {
    setVisible(false);
    setTimeout(() => setSelected(null), 250);
  };

  const visiblePhotos = photos.slice(0, 10).filter((_, i) => !failed[i]);
  if (visiblePhotos.length === 0) return null;

  const gridClass =
    visiblePhotos.length === 1
      ? 'grid-cols-1'
      : visiblePhotos.length === 2
      ? 'grid-cols-2'
      : visiblePhotos.length === 3
      ? 'grid-cols-2 md:grid-cols-3'
      : visiblePhotos.length <= 4
      ? 'grid-cols-2 md:grid-cols-4'
      : 'grid-cols-2 md:grid-cols-5';

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-heading mb-2 text-3xl font-bold text-primary md:text-4xl">
          Onze praktijk in {city}
        </h2>
        <p className="mb-10 text-muted">Een moderne en gastvrije omgeving voor uw behandeling.</p>

        <div className={`grid gap-3 ${gridClass}`}>
          {photos.slice(0, 10).map((src, i) =>
            failed[i] ? null : (
              <button
                key={i}
                type="button"
                className="overflow-hidden rounded-xl bg-secondary shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => openPhoto(src)}
              >
                <div className="relative h-56 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Praktijk foto ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                    onError={() => setFailed(prev => ({ ...prev, [i]: true }))}
                  />
                </div>
              </button>
            )
          )}
        </div>

        <p className="mt-4 text-right text-xs text-muted">Foto&apos;s via Google</p>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-250 ease-in-out ${
            visible ? 'opacity-100' : 'opacity-0'
          } bg-black/50`}
          onClick={closePhoto}
        >
          <button
            type="button"
            onClick={closePhoto}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/35"
            aria-label="Sluiten"
          >
            <X className="h-6 w-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected}
            alt="Praktijk foto groot"
            className={`max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl transition-all duration-250 ease-in-out ${
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
