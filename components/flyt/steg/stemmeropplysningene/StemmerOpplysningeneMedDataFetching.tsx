import { StemmerOpplysningene } from 'components/flyt/steg/stemmeropplysningene/StemmerOpplysningene';
import { hentUtfylling } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const StemmerOpplysningeneMedDataFetching = async ({ referanse }: Props) => {
  const utfylling = await hentUtfylling(referanse);

  return <StemmerOpplysningene utfylling={utfylling} referanse={referanse} />;
};
