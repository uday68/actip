import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const camp = db.getCampaignById(id);
      if (camp) return NextResponse.json({ success: true, data: camp });
      return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
    }

    const list = db.getCampaigns();
    return NextResponse.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
