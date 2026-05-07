import { PRACTICE_INFO } from '@/lib/constants';
import { MapPin, Car, Bus, Bike, Clock } from 'lucide-react';

const hours = [
  { day: 'Maandag', time: PRACTICE_INFO.hours.monday },
  { day: 'Dinsdag', time: PRACTICE_INFO.hours.tuesday },
  { day: 'Woensdag', time: PRACTICE_INFO.hours.wednesday },
  { day: 'Donderdag', time: PRACTICE_INFO.hours.thursday },
  { day: 'Vrijdag', time: PRACTICE_INFO.hours.friday },
  { day: 'Zaterdag', time: PRACTICE_INFO.hours.saturday, highlight: true },
  { day: 'Zondag', time: PRACTICE_INFO.hours.sunday, closed: true },
];

export default function LocationSection() {
  return (
    <section id="contact" className="bg-surface py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-heading mb-2 text-3xl font-bold text-primary md:text-4xl">
          Makkelijk te bereiken in Utrecht
        </h2>
        <p className="mb-10 text-muted">
          Centraal gelegen — goed bereikbaar per auto, bus en fiets.
        </p>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Info column */}
          <div className="space-y-8">
            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-neutral">
                  {PRACTICE_INFO.address}
                </p>
              </div>
            </div>

            {/* Transport */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Car className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm text-neutral">
                    {PRACTICE_INFO.transport.parking}
                  </p>
                  <p className="text-sm text-muted">
                    Betaald parkeren P+R Transferium op 5 min loopafstand
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Bus className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-neutral">
                  {PRACTICE_INFO.transport.bus}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Bike className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-neutral">
                  {PRACTICE_INFO.transport.bike}
                </p>
              </div>
            </div>

            {/* Evening/Saturday badge */}
            <div className="inline-block rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
              Avond- en zaterdagafspraken beschikbaar
            </div>
          </div>

          {/* Hours column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-heading text-lg font-semibold text-primary">
                Openingstijden
              </h3>
            </div>
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
              {hours.map(({ day, time, highlight, closed }) => (
                <div
                  key={day}
                  className={`flex justify-between px-4 py-3 text-sm ${
                    closed
                      ? 'text-muted'
                      : highlight
                      ? 'bg-secondary font-medium text-primary'
                      : 'text-neutral'
                  }`}
                >
                  <span>{day}</span>
                  <span className={highlight ? 'text-primary font-semibold' : ''}>
                    {time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
