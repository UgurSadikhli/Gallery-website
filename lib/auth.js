// Edge-safe: used by middleware.js and route handlers.
import { SignJWT, jwtVerify } from 'jose';

export const COOKIE_NAME = 'admin_token';
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET);

export async function signToken(email) {
  return new SignJWT({ role: 'admin', email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret());
}

export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === 'admin' ? payload : null;
  } catch {
    return null;
  }
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};
