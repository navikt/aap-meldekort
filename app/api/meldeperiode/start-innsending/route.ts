import { NextRequest, NextResponse } from 'next/server';
import { startInnsending } from 'lib/services/meldekortservice';
import { logError } from '@navikt/aap-felles-utils';
import { StartUtfyllingRequest } from 'lib/types/types';

export async function POST(req: NextRequest) {
  const startUtfyllingRequest: StartUtfyllingRequest = await req.json();

  try {
    const meldekort = await startInnsending(startUtfyllingRequest);

    return NextResponse.json(meldekort, { status: 200 });
  } catch (err) {
    logError(`/meldeperiode/start-innsending`, err);
    return NextResponse.json({ message: 'Start innsending av meldekort gikk dårlig' }, { status: 500 });
  }
}
