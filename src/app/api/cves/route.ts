import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/database';
import { cisaKevService } from '@/server/services/cisa-kev-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const search = searchParams.get('q');

    if (id) {
      const cve = db.getCveById(id);
      if (cve) return NextResponse.json({ success: true, data: cve });

      // Check official CISA KEV
      const kev = cisaKevService.lookup(id);
      if (kev) {
        return NextResponse.json({
          success: true,
          data: {
            id: kev.cveID,
            title: kev.vulnerabilityName,
            cvss: 8.5,
            severity: 'critical',
            publishedDate: kev.dateAdded,
            modifiedDate: kev.dateAdded,
            cisaKev: true,
            knownExploitation: true,
            affectsOrganization: 'suspected',
            affectedProducts: [`${kev.vendorProject} ${kev.product}`],
            associatedMalware: [],
            associatedActors: [],
            associatedCampaigns: [],
            epssScore: 0.85,
            description: kev.shortDescription,
            remediation: kev.requiredAction
          }
        });
      }

      return NextResponse.json({ success: false, error: 'CVE not found' }, { status: 404 });
    }

    if (search) {
      const kevMatches = cisaKevService.search(search);
      return NextResponse.json({
        success: true,
        count: kevMatches.length,
        data: kevMatches
      });
    }

    const list = db.getCves();
    return NextResponse.json({
      success: true,
      count: list.length,
      data: list,
      cisaCatalogSize: cisaKevService.getCatalogSize()
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
