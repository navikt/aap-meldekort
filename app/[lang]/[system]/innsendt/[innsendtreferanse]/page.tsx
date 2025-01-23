import { hentInnsendtMeldekortDetjalert } from 'lib/services/meldekortservice';
import { Korrigering } from 'components/korrigering/Korrigering';

interface Props {
  params: Promise<{
    innsendtreferanse: string;
  }>;
}

export default async function endreMeldekortPage(props: Props) {
  const params = await props.params;
  const innsendteMeldekort = await hentInnsendtMeldekortDetjalert(params.innsendtreferanse);

  return <Korrigering meldekort={innsendteMeldekort} />;
}
