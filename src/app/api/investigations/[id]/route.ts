import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/database';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const inv = db.getInvestigationById(id);

    if (!inv) {
      return NextResponse.json(
        { success: false, error: `Investigation ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: inv
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
