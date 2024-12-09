import { hentMeldeperiode } from 'lib/services/meldekortservice';

import { redirect } from 'next/navigation';

export default async function Home() {
  const meldeperiode = await hentMeldeperiode();

  if (!meldeperiode) {
    return <div>Kunne ikke finne meldekort.</div>;
  }

  redirect(`/${meldeperiode.meldekortId}`);
}
