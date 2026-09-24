import { NextRequest, NextResponse } from 'next/server';
import { mitreAttackService } from '@/server/services/mitre-attack-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const tech = mitreAttackService.getTechniqueById(id);
      if (tech) return NextResponse.json({ success: true, data: tech });
      return NextResponse.json({ success: false, error: 'Technique not found' }, { status: 404 });
    }

    const matrix = mitreAttackService.getMatrix();
    return NextResponse.json({
      success: true,
      data: matrix
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
