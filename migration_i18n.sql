-- Run once on an existing database
ALTER TABLE artist_profile ADD COLUMN IF NOT EXISTS bio_ru TEXT;
ALTER TABLE artist_profile ADD COLUMN IF NOT EXISTS bio_en TEXT;
