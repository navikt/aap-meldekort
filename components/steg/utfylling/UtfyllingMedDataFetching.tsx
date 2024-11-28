import { hentMeldeperiode } from 'lib/services/meldekortservice';
import { Utfylling } from 'components/steg/utfylling/Utfylling';

export const UtfyllingMedDataFetching = async () => {
  const meldeperiode = await hentMeldeperiode();

  return <Utfylling meldeperiode={meldeperiode} />;
};
