import { Periode } from 'components/steg/periode/Periode';
import { hentMeldekort } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const PeriodeMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentMeldekort(referanse);
  return <Periode meldekort={meldekort} referanse={referanse} />;
};
