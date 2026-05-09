import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-heading text-4xl font-bold text-gray-900">Pagina niet gevonden</h1>
      <p className="max-w-sm text-gray-500">
        De pagina die u zoekt bestaat niet of is verplaatst.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
      >
        Terug naar home
      </Link>
    </div>
  );
}
