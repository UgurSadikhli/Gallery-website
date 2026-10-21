import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getIp, rateLimit } from '@/lib/rateLimit';

export async function POST(request, { params }) {
  const id = parseInt(params.id, 10);
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  // 1) Per-IP throttle: 30 likes / minute
  if (!rateLimit(`like:${getIp(request)}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // 2) Per-browser cookie: one like per painting
  const cookieName = `liked_${id}`;
  if (request.cookies.get(cookieName)) {
    return NextResponse.json({ error: 'Already liked' }, { status: 409 });
  }

  const { rows } = await query(
    'UPDATE paintings SET likes_count = likes_count + 1 WHERE id = $1 RETURNING likes_count', [id]
  );
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const res = NextResponse.json({ likes_count: rows[0].likes_count });
  res.cookies.set(cookieName, '1', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 });
  return res;
}
