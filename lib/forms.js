export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

const clean = (v) => {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t === '' ? null : t;
};

// Returns { buffer, mime } | null (no file) | { error }
export async function readImage(file) {
  if (!file || typeof file === 'string' || file.size === 0) return null;
  if (!ALLOWED_MIME.includes(file.type)) return { error: 'Only JPEG, PNG or WebP images are allowed.' };
  if (file.size > MAX_IMAGE_BYTES) return { error: 'Image must be 10 MB or smaller.' };
  return { buffer: Buffer.from(await file.arrayBuffer()), mime: file.type };
}

// Text fields of a painting. Only fields PRESENT in formData are returned.
export function paintingFields(formData) {
  const out = {};
  for (const k of ['title', 'description', 'date_drawn', 'dimensions', 'medium']) {
    if (formData.has(k)) out[k] = clean(formData.get(k));
  }
  if (formData.has('artist_name')) out.artist_name = clean(formData.get('artist_name')) || 'Artist Name';
  if (formData.has('is_for_sale')) out.is_for_sale = ['true', 'on', '1'].includes(String(formData.get('is_for_sale')));
  if (formData.has('price')) {
    const n = parseFloat(clean(formData.get('price')));
    out.price = Number.isFinite(n) && n >= 0 ? n : null;
  }
  return out;
}

export { clean };
