import { InnsendteMeldekort } from 'components/sider/innsendtemeldekort/InnsendteMeldekort';
import { hentInnsendteMeldekort } from 'lib/services/meldekortservice';

export default async function InnsendtPage() {
  const innsendteMeldekort = await hentInnsendteMeldekort();

  return <InnsendteMeldekort innsendteMeldeperioder={innsendteMeldekort} />;
}
