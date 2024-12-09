import { hentMeldeperiode } from 'lib/services/meldekortservice';

import { redirect } from 'next/navigation';

export default async function Home() {
  const meldeperiode = await hentMeldeperiode();

  if (!meldeperiode || meldeperiode.length === 0) {
    return <div>Kunne ikke finne meldekort.</div>;
  }

  redirect(`/${meldeperiode[0].meldekortId}`);
}
