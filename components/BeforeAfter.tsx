import { BEFORE_AFTER_CASES } from '@/lib/constants';

function ImagePlaceholder({
  label,
  side,
}: {
  label: string;
  side: 'before' | 'after';
}) {
  return (
    <div
      className={`relative flex h-48 w-full items-center justify-center ${
        side === 'before'
          ? 'bg-gradient-to-br from-neutral/20 to-muted/30'
          : 'bg-gradient-to-br from-primary/20 to-secondary'
      }`}
    >
      <span
        className={`absolute ${side === 'before' ? 'left-2' : 'right-2'} top-2 rounded px-2 py-0.5 text-xs font-semibold text-white ${
          side === 'before' ? 'bg-neutral/70' : 'bg-primary/80'
        }`}
      >
        {label}
      </span>
      <span className="text-xs text-muted">{label === 'Voor' ? 'Foto volgt' : 'Resultaat volgt'}</span>
    </div>
  );
}

function CaseCard({ c }: { c: (typeof BEFORE_AFTER_CASES)[number] }) {
  return (
    <div className="overflow-hidden rounded-xl bg-secondary shadow-sm">
      <div className="flex">
        <div className="w-1/2">
          <ImagePlaceholder label="Voor" side="before" />
        </div>
        <div className="w-1/2 border-l-2 border-white">
          <ImagePlaceholder label="Na" side="after" />
        </div>
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
