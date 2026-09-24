import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/database';

export async function GET() {
  try {
    const stages = db.getPipelineStages();
    return NextResponse.json({
      success: true,
      data: stages
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
