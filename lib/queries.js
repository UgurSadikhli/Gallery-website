// Helpers for Server Components in Parts 2 and 3. None of these select image_data.
import { query, PAINTING_COLUMNS } from './db';

export async function getPaintings({ forSale = false } = {}) {
  const { rows } = await query(
    `SELECT ${PAINTING_COLUMNS} FROM paintings ${forSale ? 'WHERE is_for_sale = TRUE' : ''} ORDER BY created_at DESC`
  );
  return rows;
}

export async function getPainting(id) {
  const { rows } = await query(`SELECT ${PAINTING_COLUMNS} FROM paintings WHERE id = $1`, [id]);
  return rows[0] || null;
}

export async function incrementViews(id) {
  const { rows } = await query(
    `UPDATE paintings SET views_count = views_count + 1 WHERE id = $1 RETURNING views_count`, [id]
  );
  return rows[0]?.views_count ?? null;
}

export async function getProfile() {
  const { rows } = await query(
    `SELECT bio, bio_ru, bio_en, email, instagram_url, (avatar_data IS NOT NULL) AS has_avatar FROM artist_profile WHERE id = 1`
  );
  return rows[0] || null;
}

export async function getStats() {
  const { rows } = await query(`SELECT COUNT(*)::int AS total,
    COALESCE(SUM(likes_count),0)::int AS likes, COALESCE(SUM(views_count),0)::int AS views,
    COUNT(*) FILTER (WHERE is_for_sale)::int AS for_sale FROM paintings`);
  return rows[0];
}
