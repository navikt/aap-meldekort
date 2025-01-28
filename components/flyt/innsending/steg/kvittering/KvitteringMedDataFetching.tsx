import { Kvittering } from 'components/flyt/innsending/steg/kvittering/Kvittering';
import { hentKommendeMeldekort, hentMeldekort } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const KvitteringMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentMeldekort(referanse);
  const kommendeMeldekort = await hentKommendeMeldekort();

  return <Kvittering meldekort={meldekort} kommendeMeldekort={kommendeMeldekort} />;
};
