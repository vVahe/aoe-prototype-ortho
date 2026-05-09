type B2BClosingSectionProps = {
  practiceName: string;
};

export default function B2BClosingSection({ practiceName }: B2BClosingSectionProps) {
  return (
    <section className="bg-neutral py-16">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="font-heading mb-4 text-3xl font-bold text-white md:text-4xl">
          Dit is een demo, gemaakt voor {practiceName}.
        </h2>
        <p className="mb-4 text-base leading-relaxed text-white/70">
          Een vergelijkbare site, gepersonaliseerd voor uw praktijk, in 10 werkdagen live.
          Geen langlopende contracten.
        </p>
        <p className="text-sm text-white/50">
          Reageer op mijn bericht als u interesse heeft.
        </p>
      </div>
    </section>
  );
}
