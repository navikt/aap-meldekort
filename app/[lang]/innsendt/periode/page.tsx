import { hentHistoriskMeldekortDetaljer } from 'lib/services/meldekortservice';

interface Props {
  searchParams: Promise<{ fom: string; tom: string }>;
}

export default async function HistoriskMeldekortPage(props: Props) {
  const searchParams = await props.searchParams;

  const hisotriskMeldekortDetaljer = await hentHistoriskMeldekortDetaljer(searchParams);

  return <div>{JSON.stringify(hisotriskMeldekortDetaljer)}</div>;
}
