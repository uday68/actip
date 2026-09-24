import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/database';

export async function GET() {
  try {
    const graphData = db.getGraph();
    return NextResponse.json({
      success: true,
      nodeCount: graphData.nodes.length,
      edgeCount: graphData.edges.length,
      data: graphData
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
