import { Korrigering } from 'components/flyt/korrigering/Korrigering';
import { hentHistoriskMeldekortDetaljer } from 'lib/services/meldekortservice';

interface Props {
  searchParams: Promise<{ fom: string; tom: string }>;
}

export default async function KorrigeringPage(props: Props) {
  const searchParams = await props.searchParams;

  const historiskMeldekortDetaljer = await hentHistoriskMeldekortDetaljer(searchParams);
  const meldekortSomKanEndres = historiskMeldekortDetaljer.find((historiskMeldekort) => historiskMeldekort.kanEndres);

  if (!meldekortSomKanEndres) {
    return <div>Fant ikke meldekort som kan endres</div>;
  }
  return <Korrigering meldekort={meldekortSomKanEndres} />;
}
