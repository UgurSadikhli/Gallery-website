import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { clean, readImage } from '@/lib/forms';
import { getProfile } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getProfile());
}

export async function PUT(request) {
  const fd = await request.formData();
  const bio = clean(fd.get('bio'));
  if (!bio) return NextResponse.json({ error: 'Bio is required.' }, { status: 400 });
  const avatar = await readImage(fd.get('avatar'));
  if (avatar?.error) return NextResponse.json({ error: avatar.error }, { status: 400 });

  const base = [bio, clean(fd.get('bio_ru')), clean(fd.get('bio_en')), clean(fd.get('email')), clean(fd.get('instagram_url'))];
  if (avatar) {
    await query(`UPDATE artist_profile SET bio=$1, bio_ru=$2, bio_en=$3, email=$4, instagram_url=$5,
      avatar_data=$6, avatar_mime_type=$7 WHERE id=1`, [...base, avatar.buffer, avatar.mime]);
  } else {
    await query(`UPDATE artist_profile SET bio=$1, bio_ru=$2, bio_en=$3, email=$4, instagram_url=$5 WHERE id=1`, base);
  }
  return NextResponse.json({ ok: true });
}
