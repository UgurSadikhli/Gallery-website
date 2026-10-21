import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'crypto';
import { COOKIE_NAME, cookieOptions, signToken } from '@/lib/auth';
import { getIp, rateLimit } from '@/lib/rateLimit';

const safeEq = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

export async function POST(request) {
  if (!rateLimit(`login:${getIp(request)}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 });
  }

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { email = '', password = '' } = body;

  const { ADMIN_EMAIL, ADMIN_PASSWORD_HASH, ADMIN_PASSWORD } = process.env;
  const emailOk = safeEq(email.toLowerCase(), (ADMIN_EMAIL || '').toLowerCase());
  let passOk = false;
  if (ADMIN_PASSWORD_HASH) passOk = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  else if (ADMIN_PASSWORD) passOk = safeEq(password, ADMIN_PASSWORD);

  if (!emailOk || !passOk) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, await signToken(email), cookieOptions);
  return res;
}
