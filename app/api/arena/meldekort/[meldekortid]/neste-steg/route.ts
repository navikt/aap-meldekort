import { NextRequest } from 'next/server';
import { gåTilNesteSteg, isLocal } from 'lib/services/meldekortservice';
import { MeldekortRequest } from 'lib/types/types';
import { hentMeldekortMock, mockNesteSteg } from 'databasemock/meldekort';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  const meldekortRequest: MeldekortRequest = await req.json();

  console.log('meldekortRequest', meldekortRequest);

  if (isLocal()) {
    await mockNesteSteg(meldekortRequest);
    const meldekortResponse = await hentMeldekortMock();
    return new Response(JSON.stringify(meldekortResponse), { status: 200 });
  }

  try {
    await gåTilNesteSteg(params.referanse, meldekortRequest);
  } catch (err) {
    logError(`/arena/meldekort/${params.referanse}/neste-steg`, err);
    return new Response(JSON.stringify({ message: 'Innsending av steg gikk dårlig' }), { status: 500 });
  }
}
