import { hentMeldekort } from 'lib/services/meldekortservice';
import { StemmerOpplysningene } from 'components/flyt/innsending/steg/stemmeropplysningene/StemmerOpplysningene';

interface Props {
  referanse: string;
}

export const StemmerOpplysningeneMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentMeldekort(referanse);

  return <StemmerOpplysningene meldekort={meldekort} referanse={referanse} />;
};
