import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const actor = db.getThreatActorById(id);
      if (actor) {
        return NextResponse.json({ success: true, data: actor });
      }
      return NextResponse.json({ success: false, error: 'Threat actor not found' }, { status: 404 });
    }

    const list = db.getThreatActors();
    return NextResponse.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
