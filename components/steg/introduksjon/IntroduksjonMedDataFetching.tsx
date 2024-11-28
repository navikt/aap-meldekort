import { Introduksjon } from 'components/steg/introduksjon/Introduksjon';
import { hentMeldeperiode } from 'lib/services/meldekortservice';

export const IntroduksjonMedDataFetching = async () => {
  const meldeperiode = await hentMeldeperiode();
  return <Introduksjon meldeperiode={meldeperiode} />;
};
