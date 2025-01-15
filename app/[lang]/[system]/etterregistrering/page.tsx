import { hentMeldeperioder } from 'lib/services/meldekortservice';
import { Etterregistrering } from 'components/sider/etterregistrering/Etterregistrering';
import { meldeperioderSomKanEtterregistreres } from 'lib/utils/meldeperioder';

export default async function EtterregistreringPage() {
  const meldeperioder = await hentMeldeperioder();

  const ettersendinger = meldeperioderSomKanEtterregistreres(meldeperioder);

  return <Etterregistrering ettersendinger={ettersendinger} />;
}
