import { Introduksjon } from 'components/flyt/innsending/steg/introduksjon/Introduksjon';
import { hentMeldekort } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const IntroduksjonMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentMeldekort(referanse);

  return <Introduksjon meldekort={meldekort} referanse={referanse} />;
};
