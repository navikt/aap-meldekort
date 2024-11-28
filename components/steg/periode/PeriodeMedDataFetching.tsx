import { Periode } from 'components/steg/periode/Periode';
import { hentMeldeperiode } from 'lib/services/meldekortservice';

export const PeriodeMedDataFetching = async () => {
  const periode = await hentMeldeperiode();
  return <Periode meldeperiode={periode} />;
};
