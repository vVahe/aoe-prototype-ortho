import type { PersonalizationStatus } from '@/lib/prospect-resolvers';

export default function B2BClosingSection({ status }: { status: PersonalizationStatus }) {
  if (status.real.length === 0 && status.placeholder.length === 0) return null;

  const realText = status.real.join(', ');
  const placeholderText = status.placeholder.join(', ');

  return (
    <div className="bg-white py-6 text-center px-4">
      <p className="mx-auto max-w-2xl text-xs text-muted">
        {realText && <><strong>Deze preview gebruikt:</strong> {realText}.</>}
        {placeholderText && <><br /><strong>Voorbeelden:</strong> {placeholderText}.</>}
      </p>
    </div>
  );
}
