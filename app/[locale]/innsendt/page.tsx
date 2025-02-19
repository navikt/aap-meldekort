import { InnsendteMeldekort } from 'components/sider/innsendtemeldekort/InnsendteMeldekort';
import { hentInnsendteMeldeperioder } from 'lib/services/meldekortservice';

export default async function InnsendtPage() {
  const innsendteMeldekort = await hentInnsendteMeldeperioder();

  return <InnsendteMeldekort innsendteMeldeperioder={innsendteMeldekort} />;
}
