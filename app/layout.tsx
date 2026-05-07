import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { FAQ_QUESTIONS } from '@/lib/constants';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://orthodeboog.nl'),
  title: 'Orthodontist in Utrecht | De Boog — Beugel & Aligners',
  description:
    'Orthodontist in Utrecht voor kinderen én volwassenen. Vaste beugel vanaf €2.400, transparante aligners vanaf €3.200. ANO-gecertificeerd. Gratis kennismaking.',
  keywords:
    'orthodontist Utrecht, beugel Utrecht, Invisalign Utrecht, transparante aligner, volwassenen orthodontie',
  openGraph: {
    title: 'Orthodontist in Utrecht | De Boog',
    description: 'Rechte tanden op elke leeftijd. Gratis kennismaking.',
    images: [{ url: '/images/hero.jpg' }],
    locale: 'nl_NL',
    type: 'website',
  },
};

const schemaMarkup = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MedicalBusiness',
      name: 'Orthodontiepraktijk De Boog',
      medicalSpecialty: 'Orthodontics',
      description:
        'Orthodontist in Utrecht voor kinderen en volwassenen. Vaste beugel, transparante aligners, volwassenen orthodontie.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Leidseweg 12',
        addressLocality: 'Utrecht',
        postalCode: '3531 BG',
        addressCountry: 'NL',
      },
      telephone: '+31-30-000-0000',
      openingHours: ['Mo-Fr 08:00-19:00', 'Sa 09:00-14:00'],
      priceRange: '€€',
    },
    {
      '@type': 'LocalBusiness',
      name: 'Orthodontiepraktijk De Boog',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '187',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ_QUESTIONS.map((q) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.answer },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body>
        {children}
        <Script
          id="schema-markup"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </body>
    </html>
  );
}
