import { NextRequest } from 'next/server';
import { slettUtfylling } from 'lib/services/meldekortservice';
import { logError } from '@navikt/aap-felles-utils';

export async function DELETE(req: NextRequest, props: { params: Promise<{ meldekortid: string }> }) {
  const params = await props.params;

  try {
    await slettUtfylling(params.meldekortid);
    return new Response(JSON.stringify({}), { status: 204 });
  } catch (err) {
    logError(`/meldekort/${params.meldekortid}/slett`, err);
    return new Response(JSON.stringify({ message: 'Sletting av meldekort gikk dårlig' }), { status: 500 });
  }
}
