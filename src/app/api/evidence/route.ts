import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/database';

export async function GET() {
  try {
    const inv = db.getInvestigations()[0];
    const claims = inv ? inv.claims : [];
    return NextResponse.json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { investigationId, claimId, conflictId, resolutionNote } = body;

    const inv = db.getInvestigationById(investigationId || 'INV-2026-0842');
    if (!inv) {
      return NextResponse.json({ success: false, error: 'Investigation not found' }, { status: 404 });
    }

    const claim = inv.claims.find(c => c.id === claimId);
    if (claim && claim.contradictoryEvidence) {
      const conflict = claim.contradictoryEvidence.find(co => co.id === conflictId);
      if (conflict) {
        conflict.resolved = true;
      }
      if (resolutionNote) {
        claim.analystNote = resolutionNote;
      }
      db.saveInvestigation(inv);
    }

    return NextResponse.json({
      success: true,
      message: 'Conflict resolved and recorded in audit log',
      data: inv
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
