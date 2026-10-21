import { Pool } from 'pg';

// Reuse one pool across hot reloads in dev
const globalForPg = globalThis;
export const pool =
  globalForPg._pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
  });
if (process.env.NODE_ENV !== 'production') globalForPg._pgPool = pool;

export const query = (text, params) => pool.query(text, params);

// Metadata columns only. NEVER add image_data here.
export const PAINTING_COLUMNS = `id, title, description, date_drawn, artist_name,
  image_mime_type, dimensions, medium, is_for_sale, price, likes_count, views_count, created_at`;
