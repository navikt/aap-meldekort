import { NextRequest } from 'next/server';
import { isLocal, korrigerMeldekort } from 'lib/services/meldekortservice';
import { MeldekortKorrigeringRequest } from 'lib/types/types';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest, props: { params: Promise<{ meldekortid: string }> }) {
  const params = await props.params;
  const meldekortKorrigeringRequest: MeldekortKorrigeringRequest = await req.json();

  if (isLocal()) {
    return new Response(JSON.stringify('Korrigering fullført'), { status: 200 });
  }

  try {
    await korrigerMeldekort(params.meldekortid, meldekortKorrigeringRequest);
    return new Response(JSON.stringify('Korrigering fullført'), { status: 200 });
  } catch (err) {
    logError(`/arena/meldekort/korrigering/${params.meldekortid}`, err);
    return new Response(JSON.stringify({ message: 'Korrigering av meldekort gikk dårlig' }), { status: 500 });
  }
}
