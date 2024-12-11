import { NextRequest } from 'next/server';
import { lagreMeldekort } from 'lib/services/meldekortservice';
import { MeldekortRequest } from 'lib/types/types';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest, props: { params: Promise<{ meldekortid: string }> }) {
  const params = await props.params;
  const meldekortRequest: MeldekortRequest = await req.json();

  try {
    await lagreMeldekort(params.meldekortid, meldekortRequest);
  } catch (err) {
    logError(`/arena/meldekort/${params.meldekortid}/lagre`, err);
    return new Response(JSON.stringify({ message: 'Lagring av meldekort gikk dårlig' }), { status: 500 });
  }
}
