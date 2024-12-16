import { hentMeldeperiode } from 'lib/services/meldekortservice';

import { redirect } from 'next/navigation';

export default async function Home() {
  const meldeperiode = await hentMeldeperiode();

  if (!meldeperiode || meldeperiode.length === 0) {
    return <div>Kunne ikke finne meldeperioder.</div>;
  }

  const meldeperioder = meldeperiode
    .filter((meldeperiode) => meldeperiode.type === 'ORDINÆRT' && meldeperiode.klarForInnsending)
    .sort((a, b) => new Date(a.periode.fom).getTime() - new Date(b.periode.fom).getTime());

  redirect(`/${meldeperioder[0].meldekortId}`);
}
