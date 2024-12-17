import { Kvittering } from 'components/steg/kvittering/Kvittering';
import { hentMeldekort } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const KvitteringMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentMeldekort(referanse);
  return <Kvittering meldekort={meldekort} />;
};
