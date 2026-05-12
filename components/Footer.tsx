import { PRACTICE_INFO } from '@/lib/constants';
import { Phone, Mail, MapPin, Instagram, Facebook, BadgeCheck } from 'lucide-react';
import Image from 'next/image';

type FooterProps = {
  practice?: { name: string; phone: string; email?: string; address: string; website?: string };
};

function deriveEmail(practice?: FooterProps['practice']): string {
  if (practice?.email) return practice.email;
  if (practice?.website) {
    try {
      const hostname = new URL(practice.website).hostname.replace(/^www\./, '');
      return `info@${hostname}`;
    } catch {
      // fall through
    }
  }
  return PRACTICE_INFO.email;
}

export default function Footer({ practice }: FooterProps = {}) {
  const name    = practice?.name    ?? PRACTICE_INFO.name;
  const phone   = practice?.phone   ?? PRACTICE_INFO.phone;
  const email   = deriveEmail(practice);
  const address = practice?.address ?? PRACTICE_INFO.address;

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">

        {/* Practice identity header */}
        <div className="mb-10 border-b border-white/20 pb-8">
          <p className="font-heading text-xl font-semibold">{name}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-white/70">
              <BadgeCheck className="h-4 w-4 text-accent" />
              ISO 9001 gecertificeerd
            </span>
            <a
              href="https://knmt.nl/loopbaan/tandartsspecialisten/orthodontisten-in-de-knmt"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white px-3 py-1.5 transition-opacity hover:opacity-80"
            >
              <Image
                src="/images/asssociations/knmt-logo.svg"
                alt="KNMT"
                width={80}
                height={22}
                className="object-contain"
              />
            </a>
            <a
              href="https://www.orthodontist.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white px-3 py-1.5 transition-opacity hover:opacity-80"
            >
              <Image
                src="/images/asssociations/nvvo-logo.svg"
                alt="NVvO"
                width={72}
                height={22}
                className="object-contain"
              />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Contact */}
          <div>
            <h3 className="font-heading mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{address}</span>
              </li>
            </ul>

          </div>

          {/* Behandelingen */}
          <div>
            <h3 className="font-heading mb-4 text-lg font-semibold">Behandelingen</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {['Vaste Beugel', 'Transparante Aligner', 'Volwassenen Orthodontie', 'Retainers & Nazorg'].map(
                (item) => (
                  <li key={item}>
                    <a href="#behandelingen" className="transition-colors hover:text-accent">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Informatie */}
          <div>
            <h3 className="font-heading mb-4 text-lg font-semibold">Informatie</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {[
                'Vergoedingen & Verzekeringen',
                'Privacy Policy',
                'Contact',
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-accent">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-6 text-sm text-white/60 md:flex-row">
          <span>© 2026 {name}</span>
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="transition-colors hover:text-accent"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="transition-colors hover:text-accent"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
