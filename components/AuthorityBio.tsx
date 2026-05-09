'use client';

import { useState } from 'react';
import { CheckCircle, UserCircle2 } from 'lucide-react';
import { PRACTICE_INFO } from '@/lib/constants';

export default function AuthorityBio({ doctor: doctorProp }: { doctor?: { name: string } } = {}) {
  const { doctor } = PRACTICE_INFO;
  const doctorName = doctorProp?.name ?? doctor.name;
  const [doctorFailed, setDoctorFailed] = useState(false);

  return (
    <section id="over-ons" className="bg-secondary py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
          {/* Doctor image */}
          <div className="flex justify-center md:justify-start">
            <div className="relative h-80 w-64 overflow-hidden rounded-2xl shadow-lg md:h-96 md:w-72">
              {doctorFailed ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary">
                  <UserCircle2 className="h-32 w-32 text-primary/40" />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/images/doctor.jpg"
                  alt="Dr. Emma van den Berg, orthodontist in Utrecht"
                  className="h-full w-full object-cover object-top"
                  onError={() => setDoctorFailed(true)}
                />
              )}
            </div>
          </div>

          {/* Bio & credentials */}
          <div>
            <h2 className="font-heading mb-1 text-3xl font-bold text-primary md:text-4xl">
              {doctorName}
            </h2>
            <p className="mb-4 text-sm font-medium text-muted">Orthodontist</p>

            <ul className="mb-5 space-y-2">
              {doctor.credentials.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-neutral">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {c}
                </li>
              ))}
            </ul>

            <p className="text-sm leading-relaxed text-neutral">{doctor.bio}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
