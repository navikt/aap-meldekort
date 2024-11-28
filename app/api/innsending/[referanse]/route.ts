import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  const body = await req.json();

  console.log(params, body);

  try {
    // await oppdaterBruddPåAktivitetsplikten(params.saksnummer, body);
  } catch (err) {
    // logError(`/aktivitetsplikt/${params.referanse}/oppdater`, err);
    return new Response(JSON.stringify({ message: 'Innsending feilet' }), { status: 500 });
  }
  return new Response(JSON.stringify({}), { status: 200 });
}
