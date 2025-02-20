import { NextRequest } from 'next/server';
import { gåTilNesteSteg } from 'lib/services/meldekortservice';
import { logError, logInfo } from '@navikt/aap-felles-utils';
import { EndreUtfyllingRequest } from 'lib/types/types';

export async function POST(req: NextRequest, props: { params: Promise<{ meldekortid: string }> }) {
  const params = await props.params;
  const utfyllingRequest: EndreUtfyllingRequest = await req.json();

  // if (isLocal()) {
  //   await mockNesteSteg(utfyllingRequest);
  //   const meldekortResponse = await hentMeldekortMock();
  //   return new Response(JSON.stringify(meldekortResponse), { status: 200 });
  // }

  try {
    console.log('Kaller lagre og neste med, ' + JSON.stringify(utfyllingRequest));
    const meldekort = await gåTilNesteSteg(params.meldekortid, utfyllingRequest);

    logInfo('meldekortet fra neste steg i respons ser slik ut' + JSON.stringify(meldekort));
    return new Response(JSON.stringify(meldekort), { status: 200 });
  } catch (err) {
    logError(`/arena/meldekort/${params.meldekortid}/neste-steg`, err);
    return new Response(JSON.stringify({ message: 'Innsending av steg gikk dårlig' }), { status: 500 });
  }
}
