import { PRACTICE_INFO } from '@/lib/constants';
import { Phone, Mail, MapPin, Instagram, Facebook, Star } from 'lucide-react';

type FooterProps = {
  practice?: { name: string; phone: string; email: string; address: string };
  hours?: { weekdayText: string[] };
};

export default function Footer({ practice, hours }: FooterProps = {}) {
  const name    = practice?.name    ?? PRACTICE_INFO.name;
  const phone   = practice?.phone   ?? PRACTICE_INFO.phone;
  const email   = practice?.email   ?? PRACTICE_INFO.email;
  const address = practice?.address ?? PRACTICE_INFO.address;
  const weekdayText = hours?.weekdayText ?? [];
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
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
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 transition-colors hover:text-accent"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    {email}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{address}</span>
              </li>
              {weekdayText.length > 0 && (
                <li className="pt-1 space-y-0.5">
                  {weekdayText.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </li>
              )}
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
                'ANO-lidmaatschap',
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
          <span>© 2026 {name} · ANO-gecertificeerd</span>
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
            <a
              href="#"
              aria-label="Google Reviews"
              className="transition-colors hover:text-accent"
            >
              <Star className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
