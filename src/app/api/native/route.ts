import { NextRequest, NextResponse } from 'next/server';
import { nativeEngineService } from '@/server/services/native-engine-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'benchmark';
    const ip = searchParams.get('ip') || '185.220.101.5';
    const port = parseInt(searchParams.get('port') || '8443', 10);

    if (mode === 'jarm') {
      const data = await nativeEngineService.runCppJarm(ip, port);
      return NextResponse.json({ success: true, data });
    }

    if (mode === 'snort') {
      const rule = await nativeEngineService.runCppSnort(ip, port);
      return NextResponse.json({ success: true, rule });
    }

    if (mode === 'python') {
      const data = await nativeEngineService.runPythonAgent('full');
      return NextResponse.json({ success: true, data });
    }

    // Default: run full benchmark across both C++ and Python
    const benchmark = await nativeEngineService.runSystemBenchmark();
    return NextResponse.json({
      success: true,
      message: 'ACTIP Multi-Language Native Engine (C++20 & Python 3.12) operational',
      data: benchmark
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error executing native engines' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body.query || body.text || '185.220.101.5 CVE-2026-8912 BlackVenom RAT';
    const mode = body.mode || 'full';

    const [pythonData, cppJarm, cppSnort] = await Promise.all([
      nativeEngineService.runPythonAgent(mode, query),
      nativeEngineService.runCppJarm(body.ip || '185.220.101.5', body.port || 8443),
      nativeEngineService.runCppSnort(body.ip || '185.220.101.5', body.port || 8443, body.domain || 'quantum-defense.org')
    ]);

    return NextResponse.json({
      success: true,
      data: {
        pythonAiEngine: pythonData,
        cppJarmEngine: cppJarm,
        cppSnortRule: cppSnort
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing native engine request' },
      { status: 500 }
    );
  }
}
