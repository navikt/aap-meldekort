import { NextRequest, NextResponse } from 'next/server';
import { mellomlagreUtfylling } from 'lib/services/meldekortservice';
import { logError } from '@navikt/aap-felles-utils';
import { EndreUtfyllingRequest } from 'lib/types/types';

export async function POST(req: NextRequest, props: { params: Promise<{ meldekortid: string }> }) {
  const params = await props.params;
  const utfyllingRequest: EndreUtfyllingRequest = await req.json();

  try {
    const meldekort = await mellomlagreUtfylling(params.meldekortid, utfyllingRequest);

    return NextResponse.json(meldekort, { status: 200 });
  } catch (err) {
    logError(`/api/${params.meldekortid}/lagre`, err);
    return NextResponse.json({ message: 'Noe gikk galt med mellomlagring av utfylling' }, { status: 500 });
  }
}
