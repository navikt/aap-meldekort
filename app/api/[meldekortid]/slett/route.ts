import { NextResponse } from 'next/server';
import { slettUtfylling } from 'lib/services/meldekortservice';
import { logError } from '@navikt/aap-felles-utils';

export async function DELETE(props: { params: Promise<{ meldekortid: string }> }) {
  const params = await props.params;

  try {
    await slettUtfylling(params.meldekortid);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    logError(`/api/${params.meldekortid}/slett`, err);
    return NextResponse.json({ message: 'Noe gikk galt i sletting av mellomlagring av utfylling' }, { status: 500 });
  }
}
