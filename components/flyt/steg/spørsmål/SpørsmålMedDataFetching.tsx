import { SpRsmL } from 'components/flyt/steg/spørsmål/Spørsmål';
import { hentUtfylling } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const SpRsmLMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentUtfylling(referanse);
  return <SpRsmL utfylling={meldekort} referanse={referanse} />;
};
