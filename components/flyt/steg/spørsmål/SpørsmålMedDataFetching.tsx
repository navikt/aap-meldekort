import { Spørsmål } from 'components/flyt/steg/spørsmål/Spørsmål';
import { hentUtfylling } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const SpørsmåLMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentUtfylling(referanse);
  return <Spørsmål utfylling={meldekort} referanse={referanse} />;
};
