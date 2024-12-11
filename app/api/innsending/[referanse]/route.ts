import { NextRequest } from 'next/server';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  const body = await req.json();

  console.log(params, body);

  try {
    // await oppdaterBruddPåAktivitetsplikten(params.saksnummer, body);
  } catch (err) {
    logError(`/innsending/${params.referanse}`, err);
    return new Response(JSON.stringify({ message: 'Innsending feilet' }), { status: 500 });
  }
  return new Response(JSON.stringify({}), { status: 200 });
}
