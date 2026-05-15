import type { ReviewItem } from '@/lib/prospects';

const MAX_WORDS = 50;

function truncate(text: string) {
  const words = text.trim().split(/\s+/);
  return words.length <= MAX_WORDS ? text : words.slice(0, MAX_WORDS).join(' ') + '…';
}

function ReviewCard({
  author,
  text,
  isPlaceholder,
}: {
  author: string;
  text: string;
  isPlaceholder?: boolean;
}) {
  return (
    <figure className="relative w-72 shrink-0 select-none px-2">
      {isPlaceholder && (
        <span className="absolute right-2 top-0 rounded-full bg-muted/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
          Voorbeeld
        </span>
      )}
      <div className="mb-4 h-px w-8 bg-accent" aria-hidden />
      <blockquote>
        <p className="text-sm italic leading-relaxed text-primary/80">{text}</p>
      </blockquote>
      <figcaption className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{author}</p>
      </figcaption>
    </figure>
  );
}

export default function ReviewsSection({
  items,
  rating,
  count,
  isPlaceholder,
  googleMapsUrl,
}: {
  items: ReviewItem[];
  rating: number;
  count: number;
  isPlaceholder?: boolean;
  googleMapsUrl?: string;
}) {
  const visible = items.filter((r) => r.text && r.author && (r.rating ?? 0) >= 4);

  // Duplicate enough times so the track always exceeds the viewport width.
  // With very few cards (e.g. 2) a single duplication isn't enough — the
  // viewport catches the end and the jump is visible. We use N repetitions
  // and animate to -(1/N * 100%) so the loop point is always the true repeat.
  const MIN_ITEMS = 12;
  const reps = Math.max(2, Math.ceil(MIN_ITEMS / (visible.length || 1)));
  const track = Array.from({ length: reps }, () => visible).flat();
  const marqueeEnd = `${-(100 / reps).toFixed(4)}%`;

  // ~6s per card feels unhurried; clamp between 30s and 90s
  const duration = Math.min(90, Math.max(30, visible.length * 8));

  return (
    <section id="recensies" className="bg-secondary py-16 pb-28 md:py-20 md:pb-32">
      <div className="mb-10 px-4 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
          {isPlaceholder
            ? 'Voorbeeldreviews — wordt gevuld met jullie Google-reviews bij livegang'
            : 'Google Recensies'}
        </p>
        <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
          Wat onze klanten zeggen
        </h2>
      </div>

      {/* Overflow hidden + fade edges */}
      <div
        className="relative overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div
          className="flex w-max gap-16"
          style={{
            animation: `marquee ${duration}s linear infinite`,
            ['--marquee-end' as string]: marqueeEnd,
          }}
        >
          {track.map((r, i) => (
            <ReviewCard
              key={i}
              author={r.author!}
              text={truncate(r.text!)}
              isPlaceholder={isPlaceholder}
            />
          ))}
        </div>
      </div>

      {!isPlaceholder && googleMapsUrl && (
        <div className="mt-8 text-center">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary/60 underline transition-colors hover:text-primary/80"
          >
            Bekijk alle recensies op Google
          </a>
        </div>
      )}
    </section>
  );
}
