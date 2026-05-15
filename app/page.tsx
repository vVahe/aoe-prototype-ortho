import type { Metadata } from 'next';
import Image from 'next/image';

const TITLE = 'VAHECO — Websites voor orthodontistenpraktijken in Nederland';
const DESCRIPTION =
  'Websites die door AI worden gevonden, gebouwd voor orthodontistenpraktijken in Nederland.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: 'index, follow',
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'nl_NL',
    siteName: 'VAHECO',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

const ACCENT = '#2C5F5D';

const fraunces = {
  fontFamily: 'var(--font-fraunces), serif',
  fontOpticalSizing: 'auto' as const,
};

export default function Home() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-stone-50 text-stone-900"
    >
      <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
        <header>
          <h1 className="text-lg font-semibold tracking-[0.18em] text-stone-900 sm:text-xl">
            VAHECO
          </h1>
          <div
            aria-hidden
            className="mt-2 h-0.5 w-6"
            style={{ backgroundColor: ACCENT }}
          />
        </header>

        <section className="mt-16 space-y-8">
          <p
            className="text-4xl font-normal leading-[1.15] text-stone-900 md:text-5xl"
            style={fraunces}
          >
            Websites die door AI worden gevonden — gebouwd voor
            orthodontistenpraktijken in Nederland.
          </p>

          <p className="max-w-[60ch] text-[15px] leading-relaxed text-stone-700">
            Steeds meer patiënten stellen hun eerste vraag over een beugel niet
            aan Google, maar aan ChatGPT, Perplexity of de AI-samenvatting
            bovenaan Google. De meeste praktijkwebsites zijn daar onzichtbaar.
            VAHECO bouwt websites die dat veranderen — zodat jouw praktijk
            wordt genoemd op het moment dat een patiënt nog aan het oriënteren
            is.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="mb-3 text-xs uppercase tracking-widest text-stone-500">
            Wie
          </h2>
          <p className="max-w-[60ch] text-[15px] leading-relaxed text-stone-700">
            VAHECO is het bedrijf van Vahe Abrahamian, softwareontwikkelaar uit
            Rotterdam. De afgelopen jaren werkte hij aan digitale systemen voor
            onder andere PostNL, ANWB, Alliander, Nationale-Nederlanden,
            Capgemini en Defensie. VAHECO past die technische achtergrond nu
            toe op een specifiek probleem: orthodontistenpraktijken die
            onvindbaar zijn in het AI-tijdperk.
          </p>
        </section>

        <p
          className="mt-16 text-lg font-normal text-stone-900"
          style={fraunces}
        >
          3 praktijken per kwartaal. Vaste structuur, eigen invulling.
        </p>

        <hr className="mt-16 w-12 border-t border-stone-300" />

        <footer className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <Image
            src="/images/vahe-profile-pic.jpg"
            alt="Vahe Abrahamian"
            width={120}
            height={120}
            className="h-[120px] w-[120px] shrink-0 rounded-lg object-cover"
          />
          <div className="text-sm leading-relaxed">
            <p className="font-semibold text-stone-900">Vahe Abrahamian</p>
            <p className="text-stone-500">Oprichter · Rotterdam</p>
            <p className="mt-3">
              <a
                href="mailto:contact@vaheco.nl"
                className="text-stone-700 underline-offset-4 hover:underline"
              >
                contact@vaheco.nl
              </a>
            </p>
            <p>
              <a
                href="https://www.linkedin.com/in/vahe-abrahamian/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-700 underline-offset-4 hover:underline"
              >
                LinkedIn
              </a>
            </p>
            <p className="text-stone-500">KvK 94236429</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
