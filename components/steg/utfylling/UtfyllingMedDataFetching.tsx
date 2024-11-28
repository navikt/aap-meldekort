import { hentMeldeperiode } from 'lib/services/meldekortservice';
import { Utfylling } from 'components/steg/utfylling/Utfylling';

export const UtfyllingMedDataFetching = async () => {
  const meldeperiode = await hentMeldeperiode();

  // TODO Her må vi skille mellom to komponenter avhengig av om bruker har arbeidet eller ikke

  return <Utfylling meldeperiode={meldeperiode} />;
};
