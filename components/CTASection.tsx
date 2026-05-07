'use client';

interface CTASectionProps {
  onOpen: () => void;
}

export default function CTASection({ onOpen }: CTASectionProps) {
  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="font-heading mb-4 text-3xl font-bold text-primary md:text-4xl">
          Klaar voor een rechte lach?
        </h2>
        <button
          onClick={onOpen}
          className="mb-4 rounded-full bg-accent px-8 py-4 text-lg font-semibold text-white shadow-md transition-all hover:scale-105 hover:brightness-90"
        >
          Plan een gratis kennismaking
        </button>
        <p className="text-sm text-muted">
          Geen verplichtingen · Antwoord binnen 24 uur · Ook avond- en zaterdagafspraken
        </p>
      </div>
    </section>
  );
}
