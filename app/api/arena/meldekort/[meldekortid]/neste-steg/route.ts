import { NextRequest } from 'next/server';
import { gåTilNesteSteg, isLocal } from 'lib/services/meldekortservice';
import { MeldekortRequest } from 'lib/types/types';
import { hentMeldekortMock, mockNesteSteg } from 'databasemock/meldekort';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest, props: { params: Promise<{ meldekortid: string }> }) {
  const params = await props.params;
  const meldekortRequest: MeldekortRequest = await req.json();

  if (isLocal()) {
    await mockNesteSteg(meldekortRequest);
    const meldekortResponse = await hentMeldekortMock();
    return new Response(JSON.stringify(meldekortResponse), { status: 200 });
  }

  try {
    const meldekort = await gåTilNesteSteg(params.meldekortid, meldekortRequest);
    return new Response(JSON.stringify(meldekort), { status: 500 });
  } catch (err) {
    logError(`/arena/meldekort/${params.meldekortid}/neste-steg`, err);
    return new Response(JSON.stringify({ message: 'Innsending av steg gikk dårlig' }), { status: 500 });
  }
}
