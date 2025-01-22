import { EndreMeldekort } from 'components/sider/endremeldekort/EndreMeldekort';
import { hentInnsendtMeldekortDetjalert } from 'lib/services/meldekortservice';

interface Props {
  params: Promise<{
    innsendtreferanse: string;
  }>;
}

export default async function endreMeldekortPage(props: Props) {
  const params = await props.params;
  const innsendteMeldekort = await hentInnsendtMeldekortDetjalert(params.innsendtreferanse);

  return <EndreMeldekort meldekort={innsendteMeldekort} />;
}
