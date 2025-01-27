import { hentMeldekort } from 'lib/services/meldekortservice';
import { Utfylling } from 'components/steg/timerarbeidet/Utfylling';

interface Props {
  referanse: string;
}

export const UtfyllingMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentMeldekort(referanse);

  return <Utfylling meldekort={meldekort} referanse={referanse} />;
};
