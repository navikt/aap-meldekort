import { Oppsummering } from 'components/steg/oppsummering/Oppsummering';
import { hentMeldekort } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const OppsummeringMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentMeldekort(referanse);
  return <Oppsummering meldekort={meldekort} referanse={referanse} />;
};
