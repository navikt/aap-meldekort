import { hentUtfylling } from 'lib/services/meldekortservice';
import { Utfylling } from 'components/flyt/steg/utfylling/Utfylling';

interface Props {
  referanse: string;
}

export const UtfyllingMedDataFetching = async ({ referanse }: Props) => {
  const utfylling = await hentUtfylling(referanse);

  return <Utfylling utfylling={utfylling} />;
};
