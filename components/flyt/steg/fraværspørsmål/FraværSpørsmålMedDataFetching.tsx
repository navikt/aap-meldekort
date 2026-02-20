import { FraværSpørsmål } from 'components/flyt/steg/fraværspørsmål/FraværSpørsmål';
import { hentUtfylling } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const FraværSpørsmålMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentUtfylling(referanse);
  return <FraværSpørsmål utfylling={meldekort} />;
};
