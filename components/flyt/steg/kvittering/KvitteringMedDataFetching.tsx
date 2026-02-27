import { Kvittering } from 'components/flyt/steg/kvittering/Kvittering';
import { hentKommendeMeldeperiode } from 'lib/services/meldekortservice';
import { UtfyllingResponse } from 'lib/types/types';

interface Props {
  utfylling: UtfyllingResponse;
}

export const KvitteringMedDataFetching = async ({ utfylling }: Props) => {
  const kommendeMeldekort = await hentKommendeMeldeperiode();

  return <Kvittering utfylling={utfylling} kommendeMeldeperiode={kommendeMeldekort} />;
};
