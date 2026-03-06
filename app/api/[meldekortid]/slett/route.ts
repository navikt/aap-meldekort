import { NextRequest, NextResponse } from 'next/server';
import { slettUtfylling } from 'lib/services/meldekortservice';
import { logError } from '@navikt/aap-felles-utils';

export async function DELETE(_: NextRequest, props: { params: Promise<{ meldekortid: string }> }) {
  const params = await props.params;
  const meldekortid = params?.meldekortid;
  if (!meldekortid) {
    logError('MeldekortId finnes ikke ved kall til sletting av påbegynt meldekort, route /api/[meldekortid]/slett');
    return NextResponse.json({ message: 'Noe gikk galt i sletting av mellomlagring av utfylling' }, { status: 400 });
  }
  try {
    const res = await slettUtfylling(meldekortid);
    return NextResponse.json(res, { status: res.status });
  } catch (err) {
    logError(`/api/${meldekortid}/slett`, err);
    return NextResponse.json({ message: 'Noe gikk galt i sletting av mellomlagring av utfylling' }, { status: 500 });
  }
}
