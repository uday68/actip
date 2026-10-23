import { NextRequest, NextResponse } from 'next/server';
import { querySightings } from '@/server/storage/cassandra';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { indicator: string } }
) {
  const indicator = decodeURIComponent(params.indicator);

  if (!indicator || !indicator.trim()) {
    return NextResponse.json(
      { success: false, error: 'Missing indicator parameter' },
      { status: 400 }
    );
  }

  const result = await querySightings(indicator.trim());
  return NextResponse.json(result);
}
