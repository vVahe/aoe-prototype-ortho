import { PRACTICE_INFO } from '@/lib/constants';
import { ShieldCheck, Users, Clock, Star } from 'lucide-react';

const signals = [
  {
    icon: ShieldCheck,
    value: 'ANO-lid',
    label: 'Associatie Nederlandse Orthodontisten',
  },
  {
    icon: Users,
    value: PRACTICE_INFO.trustSignals.patients,
    label: 'behandelde patiënten',
  },
  {
    icon: Clock,
    value: PRACTICE_INFO.trustSignals.experience,
    label: 'gespecialiseerde orthodontie',
  },
  {
    icon: Star,
    value: PRACTICE_INFO.trustSignals.rating,
    label: `${PRACTICE_INFO.trustSignals.reviewCount} Google-recensies`,
  },
];

export default function TrustBar() {
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {signals.map((signal) => {
            const Icon = signal.icon;
            return (
              <div
                key={signal.label}
                className="flex flex-col items-center gap-1 text-center"
              >
                <Icon className="mb-1 h-6 w-6 text-primary" />
                <span className="font-heading text-2xl font-bold text-primary">
                  {signal.value}
                </span>
                <span className="text-xs text-muted">{signal.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
