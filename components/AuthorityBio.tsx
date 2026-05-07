'use client';

import { useState } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, Star, UserCircle2 } from 'lucide-react';
import { PRACTICE_INFO, TESTIMONIALS } from '@/lib/constants';

function StarRating({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
      ))}
    </span>
  );
}

function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length);
  const t = TESTIMONIALS[index];

  return (
    <div className="mt-6">
      <div className="relative rounded-xl bg-surface p-5 shadow-sm">
        <span className="font-heading absolute -top-3 left-4 text-4xl font-bold text-accent leading-none">
          &ldquo;
        </span>
        <p className="pt-3 text-sm leading-relaxed text-neutral">{t.text}</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <StarRating count={t.stars} />
            <p className="mt-1 text-xs font-semibold text-muted">— {t.name}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Vorige recensie"
              className="rounded-full border border-border p-1.5 text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Volgende recensie"
              className="rounded-full border border-border p-1.5 text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex gap-1.5 justify-center">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Recensie ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-primary' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AuthorityBio() {
  const { doctor } = PRACTICE_INFO;

  return (
    <section id="over-ons" className="bg-secondary py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
          {/* Doctor image */}
          <div className="flex justify-center md:justify-start">
            <div className="relative h-80 w-64 overflow-hidden rounded-2xl shadow-lg md:h-96 md:w-72">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary">
                <UserCircle2 className="h-32 w-32 text-primary/40" />
              </div>
              {/* Alt text preserved for when real photo is placed at /images/doctor.jpg */}
              <span className="sr-only">
                Dr. Emma van den Berg, orthodontist in Utrecht
              </span>
            </div>
          </div>

          {/* Bio & credentials */}
          <div>
            <h2 className="font-heading mb-1 text-3xl font-bold text-primary md:text-4xl">
              {doctor.name}
            </h2>
            <p className="mb-4 text-sm font-medium text-muted">Orthodontist</p>

            <ul className="mb-5 space-y-2">
              {doctor.credentials.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-neutral">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {c}
                </li>
              ))}
            </ul>

            <p className="text-sm leading-relaxed text-neutral">{doctor.bio}</p>

            <TestimonialCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
