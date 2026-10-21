import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getPaintings, getStats } from '@/lib/queries';
import { paintingFields, readImage } from '@/lib/forms';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [paintings, stats] = await Promise.all([getPaintings(), getStats()]);
  return NextResponse.json({ paintings, stats });
}

export async function POST(request) {
  const formData = await request.formData();
  const image = await readImage(formData.get('image'));
  if (!image) return NextResponse.json({ error: 'An image file is required.' }, { status: 400 });
  if (image.error) return NextResponse.json({ error: image.error }, { status: 400 });

  const f = { artist_name: 'Artist Name', is_for_sale: false, ...paintingFields(formData) };
  const { rows } = await query(
    `INSERT INTO paintings (title, description, date_drawn, artist_name, image_data, image_mime_type,
       dimensions, medium, is_for_sale, price)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING id, title, artist_name, is_for_sale, price, created_at`,
    [f.title ?? null, f.description ?? null, f.date_drawn ?? null, f.artist_name, image.buffer, image.mime,
     f.dimensions ?? null, f.medium ?? null, f.is_for_sale, f.is_for_sale ? f.price ?? null : null]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
