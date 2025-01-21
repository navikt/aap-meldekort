import { EndreMeldekort } from 'components/sider/endremeldekort/EndreMeldekort';
import { hentMeldekort } from 'lib/services/meldekortservice';

interface Params {
  innsendtreferanse: string;
}

interface Props {
  params: Promise<{
    innsendtreferanse: string;
  }>;
}

export default async function endreMeldekortPage(props: Props) {
  const params = await props.params;
  const meldekort = await hentMeldekort(params.innsendtreferanse);

  return <EndreMeldekort meldekort={meldekort} />;
}
