import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    author: 'Aneta Solarek',
    text: 'The best orthodontist. I completed my treatment a year ago, and choosing this orthodontist was the best decision. The orthodontist and assistants are professional, always smiling, and helpful. I am so grateful for the care, support, and my beautiful smile.',
    rating: 5,
  },
  {
    author: 'eefje wolfhagen',
    text: 'The service was excellent and helpful. After a thorough checkup, they scheduled an appointment for the brace, which was fitted perfectly. I\'m extremely satisfied with this procedure and the wonderful, friendly staff.',
    rating: 5,
  },
  {
    author: 'Auke',
    text: 'Eveline and her team not only present an honest and clear story but also deliver on their promises. I was assisted without exception by knowledgeable and friendly staff who know what they\'re doing and work well together. Highly recommended!',
    rating: 5,
  },
  {
    author: 'A N A',
    text: 'Just been to the orthodontic practice and we were helped by a very patient, cheerful, friendly, and professional team! The braces were fitted quickly, well, and nicely — now that is what you call good service!',
    rating: 5,
  },
];

function StarRating() {
  return (
    <span className="flex gap-0.5" aria-label="5 sterren">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
      ))}
    </span>
  );
}

function ReviewCard({ author, text }: { author: string; text: string }) {
  return (
    <article className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-md">
      <Quote className="mb-3 h-7 w-7 shrink-0 text-primary/20" aria-hidden />
      <p className="flex-1 text-sm leading-relaxed text-neutral">{text}</p>
      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {author.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral">{author}</p>
          <StarRating />
        </div>
        <span className="ml-auto flex items-center gap-1 text-xs text-muted">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </span>
      </div>
    </article>
  );
}

export default function ReviewsSection() {
  return (
    <section id="recensies" className="bg-secondary py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Google Recensies
          </p>
          <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
            Wat onze klanten zeggen
          </h2>
          <p className="mt-3 text-sm text-muted">
            Meer dan 187 beoordelingen — gemiddeld 4,9 / 5 sterren
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.author} author={r.author} text={r.text} />
          ))}
        </div>
      </div>
    </section>
  );
}
