import Gallery from '@/components/Gallery';
import Hero from '@/components/Hero';
import { getPaintings } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const rows = await getPaintings();
  const paintings = rows.map(({ created_at, ...p }) => p);
  return (
    <>
      <Hero imageId={rows[0]?.id ?? null} />
      <Gallery paintings={paintings} />
    </>
  );
}
