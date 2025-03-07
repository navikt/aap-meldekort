import { NextRequest } from 'next/server';
import { gåTilNesteSteg } from 'lib/services/meldekortservice';
import { logError } from '@navikt/aap-felles-utils';
import { EndreUtfyllingRequest } from 'lib/types/types';

export async function POST(req: NextRequest, props: { params: Promise<{ meldekortid: string }> }) {
  const params = await props.params;
  const utfyllingRequest: EndreUtfyllingRequest = await req.json();

  try {
    const meldekort = await gåTilNesteSteg(params.meldekortid, utfyllingRequest);

    return new Response(JSON.stringify(meldekort), { status: 200 });
  } catch (err) {
    logError(`/api/${params.meldekortid}/neste-steg`, err);
    return new Response(JSON.stringify({ message: 'Noe gikk galt i lagre-neste av utfylling' }), { status: 500 });
  }
}
