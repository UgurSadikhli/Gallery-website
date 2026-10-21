import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { rows } = await query('SELECT avatar_data, avatar_mime_type FROM artist_profile WHERE id = 1');
  const row = rows[0];
  if (!row?.avatar_data) return new NextResponse('Not found', { status: 404 });

  return new NextResponse(row.avatar_data, {
    headers: {
      'Content-Type': row.avatar_mime_type,
      'Content-Length': String(row.avatar_data.length),
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600',
    },
  });
}
