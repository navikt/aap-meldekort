import { hentHisotriskMeldekortDetaljer } from 'lib/services/meldekortservice';
import { Thomas } from 'components/flyt/korrigering/Thomas';

interface Props {
  searchParams: Promise<{ fom: string; tom: string }>;
}

export default async function endreMeldekortPage(props: Props) {
  const searchParams = await props.searchParams;

  const hisotriskMeldekortDetaljer = await hentHisotriskMeldekortDetaljer(searchParams);

  return <Thomas historiskeMeldekortDetaljer={hisotriskMeldekortDetaljer} />;
}
