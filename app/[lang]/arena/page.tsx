import { hentMeldeperioder } from 'lib/services/meldekortservice';
import { Oversikt } from 'components/oversikt/Oversikt';
import { redirect } from 'next/navigation';
import { hentNåværendeMeldeperiode } from 'lib/utils/meldeperioder';

export default async function Page() {
  const meldeperioder = await hentMeldeperioder();
  const nåværendeMeldeperiode = await hentNåværendeMeldeperiode(meldeperioder);

  if (nåværendeMeldeperiode) {
    redirect(`/arena/${nåværendeMeldeperiode.meldekortId}`);
  } else {
    return <Oversikt meldeperioder={meldeperioder} />;
  }
}
