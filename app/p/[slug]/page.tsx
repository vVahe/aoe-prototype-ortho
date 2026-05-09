import { notFound } from 'next/navigation';
import { getProspectBySlug, getAllSlugs, getProspectView } from '@/lib/prospects';
import ProspectPageClient from './ProspectPageClient';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function ProspectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prospect = getProspectBySlug(slug);
  if (!prospect) notFound();

  const view = getProspectView(prospect);
  return <ProspectPageClient view={view} />;
}
