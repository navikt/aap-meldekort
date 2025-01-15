import { hentMeldeperioder } from 'lib/services/meldekortservice';
import { Oversikt } from 'components/oversikt/Oversikt';

export default async function Page() {
  const meldeperioder = await hentMeldeperioder();

  return <Oversikt meldeperioder={meldeperioder} />;
}
