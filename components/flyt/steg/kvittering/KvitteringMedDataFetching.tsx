import { Kvittering } from 'components/flyt/steg/kvittering/Kvittering';
import { hentKommendeMeldeperiode } from 'lib/services/meldekortservice';
import { UtfyllingResponse } from 'lib/types/types';
import { isSuccess } from 'lib/utils/api';

interface Props {
  utfylling: UtfyllingResponse;
}

export const KvitteringMedDataFetching = async ({ utfylling }: Props) => {
  const response = await hentKommendeMeldeperiode();

  return <Kvittering utfylling={utfylling} kommendeMeldeperiode={isSuccess(response) ? response.data : undefined} />;
};
