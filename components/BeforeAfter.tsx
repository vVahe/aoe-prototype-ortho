'use client';

import { useState } from 'react';
import { BEFORE_AFTER_CASES } from '@/lib/constants';

function CaseCard({ c }: { c: (typeof BEFORE_AFTER_CASES)[number] }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl bg-secondary shadow-sm">
      <div className="relative h-56 w-full">
        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral/20 to-primary/10">
            <span className="text-xs text-muted">Foto volgt</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.image}
            alt={`Voor en na behandeling: ${c.treatment}`}
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        )}
      </div>

      <div className="space-y-1 px-4 py-4">
        <p className="text-sm font-semibold text-primary">
          Behandeling: {c.treatment}
        </p>
        <p className="text-sm text-neutral">Behandelduur: {c.duration}</p>
        <p className="text-sm text-muted">{c.age}</p>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  return (
    <section id="resultaten" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-heading mb-2 text-3xl font-bold text-primary md:text-4xl">
          Zo ziet een behandelresultaat eruit — van start tot retainer
        </h2>
        <p className="mb-10 text-muted">Een voorbeeld van het traject: behandeltype, looptijd en eindresultaat.</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {BEFORE_AFTER_CASES.map((c) => (
            <CaseCard key={c.id} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
