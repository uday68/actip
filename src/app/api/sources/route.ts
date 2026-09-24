import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/database';
import { cisaKevService } from '@/server/services/cisa-kev-service';

export async function GET() {
  try {
    const list = db.getSourceConnectors();
    return NextResponse.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceId } = body;

    if (sourceId === 'src-4' || !sourceId) {
      // Sync real CISA KEV
      await cisaKevService.syncWithCisa();
    }

    const nowStr = 'Just now';
    if (sourceId) {
      db.updateSourceConnector(sourceId, {
        lastSync: nowStr,
        status: 'connected'
      });
    }

    const updated = db.getSourceConnectors();
    return NextResponse.json({
      success: true,
      message: 'Source connector synchronized successfully',
      data: updated
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
