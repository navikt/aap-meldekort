import { Oversikt } from 'components/sider/oversikt/Oversikt';
import {
  hentAnsvarligSystem,
  hentInnsendteMeldeperioder,
  hentKommendeMeldeperiode,
  hentMetadata,
} from 'lib/services/meldekortservice';
import { redirect } from 'next/navigation';

export default async function Page() {
  const ansvarligSystem = await hentAnsvarligSystem();

  if (ansvarligSystem === 'FELLES') {
    redirect('https://www.nav.no/nav.no-ressurser/lenker/selvbetjening/tjenester-pa-nav.no/send-meldekort');
  }

  const [innsendteMeldeperioder, kommendeMeldeperiode, metadata] = await Promise.all([
    hentInnsendteMeldeperioder(),
    hentKommendeMeldeperiode(),
    hentMetadata(),
  ]);

  return (
    <Oversikt
      kommendeMeldeperiode={kommendeMeldeperiode}
      harInnsendteMeldeperioder={innsendteMeldeperioder.length > 0}
      metadata={metadata}
    />
  );
}
