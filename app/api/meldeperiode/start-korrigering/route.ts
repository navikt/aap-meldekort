import { NextRequest, NextResponse } from 'next/server';
import { startKorrigering } from 'lib/services/meldekortservice';
import { logError } from '@navikt/aap-felles-utils';
import { StartUtfyllingRequest } from 'lib/types/types';

export async function POST(req: NextRequest) {
  const startUtfyllingRequest: StartUtfyllingRequest = await req.json();

  try {
    const res = await startKorrigering(startUtfyllingRequest);
    return NextResponse.json(res, { status: res.status });
  } catch (err) {
    logError(`/meldeperiode/start-korrigering`, err);
    return NextResponse.json({ message: 'Start korrigering av meldekort gikk dårlig' }, { status: 500 });
  }
}
