import Image from 'next/image';
import { BEFORE_AFTER_CASES } from '@/lib/constants';

function CaseCard({ c }: { c: (typeof BEFORE_AFTER_CASES)[number] }) {
  return (
    <div className="overflow-hidden rounded-xl bg-secondary shadow-sm">
      {/* Before / After image pair */}
      <div className="flex">
        <div className="relative w-1/2">
          <Image
            src={c.beforeImage}
            alt={`Voor behandeling — ${c.treatment}`}
            width={400}
            height={300}
            className="h-48 w-full object-cover"
          />
          <span className="absolute left-2 top-2 rounded bg-neutral/70 px-2 py-0.5 text-xs font-semibold text-white">
            Voor
          </span>
        </div>
        <div className="relative w-1/2">
          <Image
            src={c.afterImage}
            alt={`Na behandeling — ${c.treatment}`}
            width={400}
            height={300}
            className="h-48 w-full object-cover"
          />
          <span className="absolute right-2 top-2 rounded bg-primary/80 px-2 py-0.5 text-xs font-semibold text-white">
            Na
          </span>
        </div>
      </div>

      {/* Case details */}
      <div className="px-4 py-4 space-y-1">
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
          Wat onze patiënten bereikten
        </h2>
        <p className="mb-10 text-muted">Echte behandelingen, echte resultaten.</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {BEFORE_AFTER_CASES.map((c) => (
            <CaseCard key={c.id} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
