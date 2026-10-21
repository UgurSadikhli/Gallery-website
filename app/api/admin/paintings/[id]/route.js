import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { paintingFields, readImage } from '@/lib/forms';

export async function PUT(request, { params }) {
  const id = parseInt(params.id, 10);
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const formData = await request.formData();
  const fields = paintingFields(formData);
  if (fields.is_for_sale === false) fields.price = null; // no price when not for sale

  const image = await readImage(formData.get('image'));
  if (image?.error) return NextResponse.json({ error: image.error }, { status: 400 });
  if (image) { fields.image_data = image.buffer; fields.image_mime_type = image.mime; }

  const keys = Object.keys(fields);
  if (!keys.length) return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });

  // Keys come from our own whitelist in paintingFields, never from user input.
  const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const { rows } = await query(
    `UPDATE paintings SET ${sets} WHERE id = $${keys.length + 1}
     RETURNING id, title, artist_name, is_for_sale, price`,
    [...keys.map((k) => fields[k]), id]
  );
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(_request, { params }) {
  const id = parseInt(params.id, 10);
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const { rowCount } = await query('DELETE FROM paintings WHERE id = $1', [id]);
  if (!rowCount) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
