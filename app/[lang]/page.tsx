import { hentMeldeperioder } from 'lib/services/meldekortservice';
import { Oversikt } from 'components/oversikt/Oversikt';
import { redirect } from 'next/navigation';
import { hentEldsteUbesvarteMeldeperiode } from 'lib/utils/meldeperioder';

export default async function Home() {
  const meldeperioder = await hentMeldeperioder();
  const eldsteUbesvarteMeldeperiode = await hentEldsteUbesvarteMeldeperiode(meldeperioder);

  if (eldsteUbesvarteMeldeperiode) {
    redirect(`/${eldsteUbesvarteMeldeperiode.meldekortId}`);
  } else {
    return <Oversikt meldeperioder={meldeperioder} />;
  }
}
