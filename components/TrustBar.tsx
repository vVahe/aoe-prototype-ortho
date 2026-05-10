import { Users, Clock, Shield, GraduationCap, BadgeCheck } from 'lucide-react';
import { PRACTICE_INFO } from '@/lib/constants';

type Block = { kind: 'stat'; value: string; label: string; icon: React.ElementType };

const blocks: Block[] = [
  {
    kind: 'stat',
    icon: Shield,
    value: 'KNMT',
    label: 'Aangesloten bij',
  },
  {
    kind: 'stat',
    icon: GraduationCap,
    value: 'NVvO',
    label: 'Aangesloten bij',
  },
  {
    kind: 'stat',
    icon: BadgeCheck,
    value: 'ISO 9001',
    label: 'gecertificeerd',
  },
  {
    kind: 'stat',
    icon: Users,
    value: PRACTICE_INFO.trustSignals.patients,
    label: 'behandelde patiënten',
  },
  {
    kind: 'stat',
    icon: Clock,
    value: PRACTICE_INFO.trustSignals.experience,
    label: 'gespecialiseerde orthodontie',
  },
];

export default function TrustBar() {
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {blocks.map((block) => {
            const Icon = block.icon;
            return (
              <div
                key={block.value}
                className="flex flex-col items-center gap-1 text-center"
              >
                <Icon className="mb-1 h-6 w-6 text-primary" />
                <span className="font-heading text-2xl font-bold text-primary">
                  {block.value}
                </span>
                <span className="text-xs text-muted">{block.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
