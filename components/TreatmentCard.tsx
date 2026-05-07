'use client';

import { useState } from 'react';
import { Braces, Layers, UserCheck, ChevronDown } from 'lucide-react';
import { TREATMENTS } from '@/lib/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Braces,
  Layers,
  UserCheck,
};

interface TreatmentCardProps {
  treatment: (typeof TREATMENTS)[number];
  onOpenBooking: () => void;
}

function TreatmentCardItem({ treatment, onOpenBooking }: TreatmentCardProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const Icon = iconMap[treatment.icon];

  return (
    <div className="flex flex-col rounded-xl border-l-4 border-primary bg-surface p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        {Icon && <Icon className="h-7 w-7 text-primary" />}
        <h3 className="font-heading text-xl font-semibold text-primary">
          {treatment.title}
        </h3>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-neutral">
        {treatment.description}
      </p>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-muted">Vanaf</span>
          <p className="font-heading text-2xl font-bold text-primary">
            {treatment.priceFrom}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted">Behandelduur</span>
          <p className="text-sm font-medium text-neutral">{treatment.duration}</p>
        </div>
      </div>

      <div className="mb-6 space-y-2">
        {treatment.faq.map((item, i) => (
          <div key={i} className="rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-neutral hover:bg-secondary transition-colors"
            >
              {item.q}
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted transition-transform ${
                  openFaq === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openFaq === i && (
              <div className="bg-secondary px-4 py-3 text-sm leading-relaxed text-neutral">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onOpenBooking}
        className="mt-auto w-full rounded-full bg-accent py-3 text-sm font-semibold text-white transition-all hover:brightness-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
      >
        Gratis consult aanvragen
      </button>
    </div>
  );
}

interface TreatmentCardsProps {
  onOpenBooking: () => void;
}

export default function TreatmentCards({ onOpenBooking }: TreatmentCardsProps) {
  return (
    <section id="behandelingen" className="bg-surface py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-heading mb-2 text-3xl font-bold text-primary md:text-4xl">
          Onze behandelingen
        </h2>
        <p className="mb-10 text-muted">
          Voor kinderen, tieners én volwassenen — met transparante prijzen.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TREATMENTS.map((treatment) => (
            <TreatmentCardItem
              key={treatment.id}
              treatment={treatment}
              onOpenBooking={onOpenBooking}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
