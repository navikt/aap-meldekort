import { SpRsmL } from 'components/flyt/innsending/steg/spørsmål/Spørsmål';
import { hentMeldekort } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const SpRsmLMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentMeldekort(referanse);
  return <SpRsmL meldekort={meldekort} referanse={referanse} />;
};
