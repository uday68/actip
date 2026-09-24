import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/database';
import { investigationAgent } from '@/server/services/investigation-agent';

export async function GET() {
  try {
    const list = db.getInvestigations();
    return NextResponse.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to list investigations' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let query = '';
    if (typeof body.query === 'string') {
      query = body.query;
    } else if (Array.isArray(body.indicators)) {
      query = body.indicators.join(' ');
    } else if (typeof body.indicators === 'string') {
      query = body.indicators;
    } else if (typeof body.title === 'string') {
      query = body.title;
    }

    if (!query || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Query, title, or indicators are required' },
        { status: 400 }
      );
    }

    // Execute real agentic investigation pipeline
    const result = await investigationAgent.execute(query);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Investigation failed' },
      { status: 500 }
    );
  }
}
