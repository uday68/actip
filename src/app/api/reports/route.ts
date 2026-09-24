import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/database';
import { ThreatReport } from '@/lib/mock-data/reports';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const rep = db.getReportById(id);
      if (rep) return NextResponse.json({ success: true, data: rep });
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    const list = db.getReports();
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
    const investigationId = body.investigationId || 'INV-2026-0842';
    const inv = db.getInvestigationById(investigationId);

    if (!inv) {
      return NextResponse.json({ success: false, error: 'Investigation not found' }, { status: 404 });
    }

    const repId = `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-ACTIP`;
    const nowIso = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    const newReport: ThreatReport = {
      id: repId,
      title: `Intelligence Assessment: ${inv.query.split(',')[0]} Intrusion Activity`,
      tlp: 'AMBER',
      date: nowIso,
      author: 'ACTIP Automated Agentic CTI Engine & Tier-3 SOC Intel Desk',
      classification: 'RESTRICTED / TLP:AMBER / LAW ENFORCEMENT & PARTICIPATING SOCs',
      investigationRef: inv.id,
      confidenceScore: inv.confidenceScore,
      executiveSummary: inv.executiveSummary,
      investigationScope: [
        `Analysis of observables: ${inv.query}`,
        'Passive DNS and TLS certificate telemetry',
        'Cross-correlation against CISA KEV and ThreatFox repositories'
      ],
      keyFindings: inv.keyFindings,
      threatActorAnalysis: {
        name: 'APT-84 (RedBanshee / Cobalt Frost)',
        aliases: ['Cobalt Frost', 'TEMP.Tundra', 'UAC-0098'],
        attributionConfidence: 91,
        summary: 'APT-84 is an advanced cyber espionage actor focused on critical infrastructure and defense blueprints.',
        geopoliticalContext: 'Aligned with defense procurement cycles and aerospace joint ventures.'
      },
      infrastructureAnalysis: {
        primaryNodes: ['185.220.101.5 (Port 8443 HTTPS, Port 22 SSH)'],
        stagingNodes: ['185.220.101.19'],
        domains: ['quantum-defense.org'],
        jarmFingerprints: ['27d36d2d000d000dc427d36d2d000d'],
        autonomousSystems: ['AS49870 (Solaris Networks BV)']
      },
      malwareAnalysis: {
        name: 'BlackVenom RAT',
        version: '3.2',
        capabilities: [
          'In-memory NTDLL unhooking (EDR bypass)',
          'TLS 1.3 heartbeat beaconing',
          'Direct system call invocation'
        ],
        yaraRule: 'RULE_APT84_BLACKVENOM_LOADER_V3'
      },
      vulnerabilityAnalysis: {
        cve: 'CVE-2026-8912',
        cvss: 9.8,
        kevStatus: 'Added to CISA KEV (Emergency Directive)',
        impact: 'Unauthenticated Remote Code Execution'
      },
      attackMapping: [
        { tactic: 'Initial Access', techniqueId: 'T1190', techniqueName: 'Exploit Public-Facing Application', evidence: 'Exploit POST /api/v2/vpn/tunnel' },
        { tactic: 'Command and Control', techniqueId: 'T1071.001', techniqueName: 'Web Protocols', evidence: 'Port 8443 encrypted beaconing' }
      ],
      timeline: [
        { date: '2026-09-01', event: 'Infrastructure discovered', category: 'Infrastructure' },
        { date: '2026-09-05', event: 'CISA KEV addition', category: 'Advisory' },
        { date: '2026-09-15', event: 'Telemetry beacon detected', category: 'Detection' }
      ],
      evidenceSummary: {
        totalSources: inv.sourcesCount,
        meanReliability: 93.4,
        conflictingEvidenceResolved: true,
        conflictNote: 'Resolved attribution conflict from CrowdSensor CS-994 (VPS hosting proxy).'
      },
      recommendedActions: inv.recommendedActions,
      stixBundle: {
        type: 'bundle',
        id: `bundle--${Math.random().toString(36).substring(2, 15)}`,
        spec_version: '2.1',
        objects: [
          {
            type: 'threat-actor',
            spec_version: '2.1',
            id: 'threat-actor--apt84',
            name: 'APT-84 (RedBanshee)'
          },
          {
            type: 'indicator',
            spec_version: '2.1',
            id: 'indicator--target',
            pattern: `[ipv4-addr:value = '${inv.query.split(',')[0].trim()}']`
          }
        ]
      }
    };

    db.saveReport(newReport);

    return NextResponse.json({
      success: true,
      data: newReport
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
