import { NextRequest, NextResponse } from 'next/server';
import { gåTilNesteSteg } from 'lib/services/meldekortservice';
import { logError } from '@navikt/aap-felles-utils';
import { EndreUtfyllingRequest } from 'lib/types/types';

export async function POST(req: NextRequest, props: { params: Promise<{ meldekortid: string }> }) {
  const params = await props.params;
  const utfyllingRequest: EndreUtfyllingRequest = await req.json();

  try {
    const res = await gåTilNesteSteg(params.meldekortid, utfyllingRequest);
    return NextResponse.json(res, { status: res.status });
  } catch (err) {
    logError(`/api/${params.meldekortid}/neste-steg`, err);
    return NextResponse.json({ message: 'Noe gikk galt i lagre-neste av utfylling' }, { status: 500 });
  }
}
