import { PRACTICE_INFO } from '@/lib/constants';
import { Phone, Mail, MapPin, Instagram, Facebook, Star } from 'lucide-react';

export default function Footer() {
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
                  href={`tel:${PRACTICE_INFO.phone}`}
                  className="flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {PRACTICE_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${PRACTICE_INFO.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {PRACTICE_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{PRACTICE_INFO.address}</span>
              </li>
              <li className="pt-1">
                <span className="block">Ma–Vr 8:00–19:00</span>
                <span className="block">Za 9:00–14:00</span>
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
          <span>© 2026 {PRACTICE_INFO.name} · ANO-gecertificeerd</span>
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
