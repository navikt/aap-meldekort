import { hentMeldeperioder } from 'lib/services/meldekortservice';
import { InnsendteMeldekort } from 'components/sider/innsendtemeldekort/InnsendteMeldekort';

export default async function InnsendtPage() {
  const meldeperioder = await hentMeldeperioder();
  const meldeperioderSomKanEndres = meldeperioder.filter((meldeperiode) => meldeperiode.kanEndres);

  return <InnsendteMeldekort innsendteMeldeperioder={meldeperioderSomKanEndres} />;
}
