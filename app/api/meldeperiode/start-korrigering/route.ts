import { NextRequest } from 'next/server';
import { startKorrigering } from 'lib/services/meldekortservice';
import { logError, logInfo } from '@navikt/aap-felles-utils';
import { StartUtfyllingRequest } from 'lib/types/types';

export async function POST(req: NextRequest) {
  const startUtfyllingRequest: StartUtfyllingRequest = await req.json();

  try {
    const meldekort = await startKorrigering(startUtfyllingRequest);

    logInfo('Start innsending av korrigering for meldekort sin respons ser slik ut: ' + JSON.stringify(meldekort));
    return new Response(JSON.stringify(meldekort), { status: 200 });
  } catch (err) {
    logError(`/meldeperiode/start-korrigering`, err);
    return new Response(JSON.stringify({ message: 'Start korrigering av meldekort gikk dårlig' }), { status: 500 });
  }
}
