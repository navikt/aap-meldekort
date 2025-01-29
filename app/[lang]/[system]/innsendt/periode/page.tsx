import { hentInnsendtMeldekortDetjalert } from 'lib/services/meldekortservice';
import { Korrigering } from 'components/flyt/korrigering/Korrigering';

interface Props {
  searchParams: Promise<{ fom: string; tom: string }>;
}

export default async function endreMeldekortPage(props: Props) {
  const searchParams = await props.searchParams;

  const innsendteMeldekort = await hentInnsendtMeldekortDetjalert(searchParams);

  return <Korrigering meldekort={innsendteMeldekort} />;
}
