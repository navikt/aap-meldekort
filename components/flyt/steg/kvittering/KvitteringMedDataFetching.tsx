import { Kvittering } from 'components/flyt/steg/kvittering/Kvittering';
import { hentKommendeMeldeperiode, hentUtfylling } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const KvitteringMedDataFetching = async ({ referanse }: Props) => {
  const utfylling = await hentUtfylling(referanse);
  const kommendeMeldekort = await hentKommendeMeldeperiode();

  return <Kvittering utfylling={utfylling} kommendeMeldeperiode={kommendeMeldekort} />;
};
