import type { ReviewItem } from '@/lib/prospects';

const MAX_WORDS = 50;

function truncate(text: string) {
  const words = text.trim().split(/\s+/);
  return words.length <= MAX_WORDS ? text : words.slice(0, MAX_WORDS).join(' ') + '…';
}

function ReviewCard({ author, text }: { author: string; text: string }) {
  return (
    <figure className="w-72 shrink-0 select-none px-2">
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
}: {
  items: ReviewItem[];
  rating: number;
  count: number;
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

  // ~4s per card feels unhurried; clamp between 20s and 60s
  const duration = Math.min(60, Math.max(20, visible.length * 5));

  return (
    <section id="recensies" className="bg-secondary py-16 pb-28 md:py-20 md:pb-32">
      <div className="mb-10 text-center px-4">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
          Google Recensies
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
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div
          className="flex gap-5 w-max"
          style={{ animation: `marquee ${duration}s linear infinite`, ['--marquee-end' as string]: marqueeEnd }}
        >
          {track.map((r, i) => (
            <ReviewCard key={i} author={r.author!} text={truncate(r.text!)} />
          ))}
        </div>
      </div>
    </section>
  );
}
