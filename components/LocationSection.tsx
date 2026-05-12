import { PRACTICE_INFO } from '@/lib/constants';
import type { LocationInfo } from '@/lib/prospects';
import { Car, Bus, Bike, Clock, Toilet, Accessibility } from 'lucide-react';

type LocationProps = Pick<LocationInfo, 'parking' | 'publicTransport' | 'bike' | 'restroom' | 'parkingOptions' | 'accessibilityOptions'>;

const FALLBACK_HOURS = [
  { day: 'Maandag', time: PRACTICE_INFO.hours.monday },
  { day: 'Dinsdag', time: PRACTICE_INFO.hours.tuesday },
  { day: 'Woensdag', time: PRACTICE_INFO.hours.wednesday },
  { day: 'Donderdag', time: PRACTICE_INFO.hours.thursday },
  { day: 'Vrijdag', time: PRACTICE_INFO.hours.friday },
  { day: 'Zaterdag', time: PRACTICE_INFO.hours.saturday, highlight: true },
  { day: 'Zondag', time: PRACTICE_INFO.hours.sunday, closed: true },
];

function parseWeekdayText(lines: string[]) {
  return lines.map((line) => {
    const sep = line.indexOf(': ');
    const day  = sep > 0 ? line.slice(0, sep) : line;
    const time = sep > 0 ? line.slice(sep + 2) : '';
    const dayLower = day.toLowerCase();
    return {
      day: day.charAt(0).toUpperCase() + day.slice(1),
      time,
      highlight: dayLower.includes('zaterdag') || dayLower.includes('saturday'),
      closed: /gesloten|closed/i.test(time),
    };
  });
}

export default function LocationSection({
  practice,
  hours: hoursProp,
  location,
}: {
  practice?: { name?: string; city: string; address: string };
  hours?: { weekdayText: string[] };
  location?: LocationProps;
} = {}) {
  const city    = practice?.city    ?? 'Utrecht';
  const address = practice?.address ?? PRACTICE_INFO.address; // used for map query only
  const hours   = hoursProp?.weekdayText?.length
    ? parseWeekdayText(hoursProp.weekdayText)
    : FALLBACK_HOURS;

  const mapQuery  = practice?.name ? `${practice.name}, ${address}` : address;
  const mapSrc    = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&hl=nl`;

  const parkingText = (() => {
    const opts = location?.parkingOptions;
    const base = location?.parking;
    if (!opts) return base;
    const parts: string[] = [];
    if (opts.freeParkingLot) parts.push('gratis parkeerplaats');
    else if (opts.paidParkingLot) parts.push('betaalde parkeerplaats');
    if (opts.freeStreetParking) parts.push('gratis straatparkeren');
    else if (opts.paidStreetParking) parts.push('betaald straatparkeren');
    if (opts.valetParking) parts.push('valet parking');
    if (parts.length === 0) return base;
    const options = parts.join(' en ');
    return base ? `${base} — ${options}` : `Parkeren: ${options.charAt(0).toUpperCase() + options.slice(1)}`;
  })();

  const accessibility = location?.accessibilityOptions;
  const isWheelchairAccessible =
    accessibility?.wheelchairAccessibleEntrance ||
    accessibility?.wheelchairAccessibleParking ||
    accessibility?.wheelchairAccessibleRestroom ||
    accessibility?.wheelchairAccessibleSeating;

  const wheelchairLabel = (() => {
    if (!accessibility) return null;
    const features: string[] = [];
    if (accessibility.wheelchairAccessibleParking) features.push('parkeren');
    if (accessibility.wheelchairAccessibleEntrance) features.push('ingang');
    if (accessibility.wheelchairAccessibleRestroom) features.push('toilet');
    if (accessibility.wheelchairAccessibleSeating) features.push('zitplaatsen');
    return features.length > 0
      ? `Rolstoel toegankelijk: ${features.join(', ')}`
      : null;
  })();

  return (
    <section id="contact" className="bg-surface py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-heading mb-8 text-3xl font-bold text-primary md:text-4xl">
          Makkelijk te bereiken in {city}
        </h2>

        {/* Map embed */}
        <div className="mb-10 overflow-hidden rounded-xl border border-border shadow-sm">
          <iframe
            src={mapSrc}
            width="100%"
            height="340"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Locatie van ${practice?.name ?? 'de praktijk'}`}
          />
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Info column */}
          <div className="space-y-8">
            {/* Transport & facilities */}
            {(parkingText || location?.publicTransport || location?.bike || location?.restroom || isWheelchairAccessible) && (
              <div className="space-y-3">
                {parkingText && (
                  <div className="flex items-start gap-3">
                    <Car className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm text-neutral">{parkingText}</p>
                  </div>
                )}
                {location?.publicTransport && (
                  <div className="flex items-start gap-3">
                    <Bus className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm text-neutral">{location.publicTransport}</p>
                  </div>
                )}
                {location?.bike && (
                  <div className="flex items-start gap-3">
                    <Bike className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm text-neutral">{location.bike}</p>
                  </div>
                )}
                {location?.restroom && (
                  <div className="flex items-start gap-3">
                    <Toilet className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm text-neutral">Toilet aanwezig</p>
                  </div>
                )}
                {wheelchairLabel && (
                  <div className="flex items-start gap-3">
                    <Accessibility className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm text-neutral">{wheelchairLabel}</p>
                  </div>
                )}
              </div>
            )}


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
                  <span className={highlight && !closed ? 'text-primary font-semibold' : ''}>
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
