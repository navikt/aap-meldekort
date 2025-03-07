import { NextRequest } from 'next/server';
import { slettUtfylling } from 'lib/services/meldekortservice';
import { logError } from '@navikt/aap-felles-utils';

export async function DELETE(req: NextRequest, props: { params: Promise<{ meldekortid: string }> }) {
  const params = await props.params;

  try {
    await slettUtfylling(params.meldekortid);
    return new Response(null, { status: 204 });
  } catch (err) {
    logError(`/api/${params.meldekortid}/slett`, err);
    return new Response(JSON.stringify({ message: 'Noe gikk galt i sletting av mellomlagring av utfylling' }), {
      status: 500,
    });
  }
}
