import { notFound } from 'next/navigation';
import { preload } from 'react-dom';
import { getProspectBySlug, getAllSlugs, getProspectView } from '@/lib/prospects';
import ProspectPageClient from './ProspectPageClient';

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProspectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prospect = await getProspectBySlug(slug);
  if (!prospect) notFound();

  const realPhotos = prospect.practice.photos ?? [];
  const heroSrc = realPhotos.length > 0
    ? realPhotos[0]
    : '/images/placeholders/practice/03-reception.webp';
  preload(heroSrc, { as: 'image' });

  const view = getProspectView(prospect);
  return <ProspectPageClient view={view} />;
}
