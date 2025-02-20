import { Bekreft } from 'components/flyt/steg/bekreft/Bekreft';
import { hentUtfylling } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const BekreftMedDataFetching = async ({ referanse }: Props) => {
  const utfylling = await hentUtfylling(referanse);

  return <Bekreft utfylling={utfylling} referanse={referanse} />;
};
