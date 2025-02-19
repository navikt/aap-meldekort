import { NextRequest } from 'next/server';
import { startInnsending } from 'lib/services/meldekortservice';
import { logError, logInfo } from '@navikt/aap-felles-utils';
import { StartUtfyllingRequest } from 'lib/types/types';

export async function POST(req: NextRequest) {
  const startUtfyllingRequest: StartUtfyllingRequest = await req.json();

  try {
    const meldekort = await startInnsending(startUtfyllingRequest);

    logInfo('Start innsending av meldekort sin respons ser slik ut: ' + JSON.stringify(meldekort));
    return new Response(JSON.stringify(meldekort), { status: 200 });
  } catch (err) {
    logError(`/meldeperiode/start-innsending`, err);
    return new Response(JSON.stringify({ message: 'Start innsending av meldekort gikk dårlig' }), { status: 500 });
  }
}
