CREATE TABLE IF NOT EXISTS paintings (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(255),
  description     TEXT,
  date_drawn      VARCHAR(100),
  artist_name     VARCHAR(150) NOT NULL DEFAULT 'Artist Name',
  image_data      BYTEA NOT NULL,
  image_mime_type VARCHAR(50) NOT NULL,
  dimensions      VARCHAR(100),
  medium          VARCHAR(100),
  is_for_sale     BOOLEAN DEFAULT FALSE,
  price           NUMERIC(10, 2),
  likes_count     INTEGER DEFAULT 0,
  views_count     INTEGER DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_paintings_created_at ON paintings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_paintings_for_sale ON paintings (is_for_sale);

-- Single-row table (id is forced to 1)
CREATE TABLE IF NOT EXISTS artist_profile (
  id               SERIAL PRIMARY KEY CHECK (id = 1),
  bio              TEXT NOT NULL,
  bio_ru           TEXT,
  bio_en           TEXT,
  email            VARCHAR(255),
  instagram_url    VARCHAR(255),
  avatar_data      BYTEA,
  avatar_mime_type VARCHAR(50)
);
INSERT INTO artist_profile (id, bio)
VALUES (1, 'Write your story here from the admin panel.')
ON CONFLICT (id) DO NOTHING;
