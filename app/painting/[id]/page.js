import { notFound } from 'next/navigation';
import PaintingView from '@/components/PaintingView';
import { getPainting, getProfile, incrementViews } from '@/lib/queries';
import { getDict } from '@/lib/i18n-server';

export const dynamic = 'force-dynamic';

const parseId = (v) => { const n = parseInt(v, 10); return Number.isInteger(n) ? n : null; };

export async function generateMetadata({ params }) {
  const id = parseId(params.id);
  const p = id && (await getPainting(id));
  if (!p) return { title: 'Not found' };
  const title = p.title || getDict().t('common.untitled');
  const description = p.description?.slice(0, 160) || `${title} by ${p.artist_name}`;
  const image = `/api/paintings/${id}/image`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'article', images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function PaintingPage({ params }) {
  const id = parseId(params.id);
  if (!id) notFound();
  const painting = await getPainting(id);
  if (!painting) notFound();

  await incrementViews(id); // count this visit
  const profile = await getProfile();
  const { created_at, ...data } = painting;
  return <PaintingView painting={data} contactEmail={profile?.email} />;
}
