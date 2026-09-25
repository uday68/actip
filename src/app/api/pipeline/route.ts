import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/database';
import { pipelineService } from '@/server/services/pipeline-service';

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

export async function POST() {
  try {
    const result = await pipelineService.runFullIngestion();
    return NextResponse.json({
      success: true,
      message: 'Ingestion pipeline executed successfully across all downloaded threat datasets',
      data: result
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Pipeline ingestion failed' }, { status: 500 });
  }
}
