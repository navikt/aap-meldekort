import { FraværUtfylling } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { hentUtfylling } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const FraværSpørsmålMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentUtfylling(referanse);
  return <FraværUtfylling utfylling={meldekort} />;
};
