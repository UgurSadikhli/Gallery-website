import { NextResponse } from 'next/server';
import { getPaintings } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const forSale = new URL(request.url).searchParams.get('for_sale') === 'true';
  return NextResponse.json(await getPaintings({ forSale }));
}
