import { HarDuArbeidet } from 'components/flyt/innsending/steg/harduarbeidet/HarDuArbeidet';
import { hentMeldekort } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const HarDuArbeidetMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentMeldekort(referanse);
  return <HarDuArbeidet meldekort={meldekort} referanse={referanse} />;
};
