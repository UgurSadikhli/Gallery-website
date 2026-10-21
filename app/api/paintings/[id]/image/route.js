import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const id = parseInt(params.id, 10);
  if (!Number.isInteger(id)) return new NextResponse('Not found', { status: 404 });

  const { rows } = await query('SELECT image_data, image_mime_type FROM paintings WHERE id = $1', [id]);
  const row = rows[0];
  if (!row) return new NextResponse('Not found', { status: 404 });

  return new NextResponse(row.image_data, {
    headers: {
      'Content-Type': row.image_mime_type,
      'Content-Length': String(row.image_data.length),
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  });
}
