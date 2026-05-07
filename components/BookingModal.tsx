'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, CheckCircle } from 'lucide-react';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const treatmentOptions = [
  'Vaste beugel',
  'Transparante aligner',
  'Volwassenen orthodontie',
  'Weet ik nog niet',
];

export default function BookingModal({ open, onClose }: BookingModalProps) {
  const [naam, setNaam] = useState('');
  const [telefoon, setTelefoon] = useState('');
  const [behandeling, setBehandeling] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ naam?: string; telefoon?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!naam.trim()) next.naam = 'Vul uw naam in.';
    if (!telefoon.trim()) next.telefoon = 'Vul uw telefoonnummer in.';
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    console.log('Booking request:', { naam, telefoon, behandeling });
    setSubmitted(true);
  };

  const handleClose = () => {
    setNaam('');
    setTelefoon('');
    setBehandeling('');
    setErrors({});
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-6 shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 md:p-8 max-h-[90vh] overflow-y-auto">
          <div className="mb-6 flex items-start justify-between">
            <Dialog.Title className="font-heading text-2xl font-bold text-primary">
              Plan uw gratis kennismaking
            </Dialog.Title>
            <Dialog.Close
              onClick={handleClose}
              className="rounded-full p-1 text-muted transition-colors hover:bg-secondary hover:text-neutral"
              aria-label="Sluiten"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle className="h-14 w-14 text-primary" />
              <p className="text-lg font-semibold text-primary">
                Bedankt, {naam}!
              </p>
              <p className="text-sm leading-relaxed text-neutral">
                We nemen binnen 24 uur contact op om uw afspraak te bevestigen.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-90"
              >
                Sluiten
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Naam */}
              <div>
                <label
                  htmlFor="naam"
                  className="mb-1 block text-sm font-semibold text-neutral"
                >
                  Naam <span className="text-accent">*</span>
                </label>
                <input
                  id="naam"
                  type="text"
                  value={naam}
                  onChange={(e) => {
                    setNaam(e.target.value);
                    if (errors.naam) setErrors((prev) => ({ ...prev, naam: undefined }));
                  }}
                  placeholder="Uw volledige naam"
                  className={`w-full rounded-lg border px-4 py-3 text-sm text-neutral placeholder-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    errors.naam ? 'border-accent' : 'border-border'
                  }`}
                />
                {errors.naam && (
                  <p className="mt-1 text-xs text-accent">{errors.naam}</p>
                )}
              </div>

              {/* Telefoon */}
              <div>
                <label
                  htmlFor="telefoon"
                  className="mb-1 block text-sm font-semibold text-neutral"
                >
                  Telefoonnummer <span className="text-accent">*</span>
                </label>
                <input
                  id="telefoon"
                  type="tel"
                  value={telefoon}
                  onChange={(e) => {
                    setTelefoon(e.target.value);
                    if (errors.telefoon) setErrors((prev) => ({ ...prev, telefoon: undefined }));
                  }}
                  placeholder="+31 6 00 00 00 00"
                  className={`w-full rounded-lg border px-4 py-3 text-sm text-neutral placeholder-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    errors.telefoon ? 'border-accent' : 'border-border'
                  }`}
                />
                {errors.telefoon && (
                  <p className="mt-1 text-xs text-accent">{errors.telefoon}</p>
                )}
              </div>

              {/* Behandeling */}
              <div>
                <label
                  htmlFor="behandeling"
                  className="mb-1 block text-sm font-semibold text-neutral"
                >
                  Behandeling interesse
                </label>
                <select
                  id="behandeling"
                  value={behandeling}
                  onChange={(e) => setBehandeling(e.target.value)}
                  className="w-full rounded-lg border border-border px-4 py-3 text-sm text-neutral outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface"
                >
                  <option value="">Selecteer een behandeling</option>
                  {treatmentOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-white transition-all hover:brightness-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
              >
                Verstuur aanvraag
              </button>

              <p className="text-center text-xs text-muted">
                Geen verplichtingen · Antwoord binnen 24 uur
              </p>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
