import { Oversikt } from 'components/sider/oversikt/Oversikt';
import {
  hentAnsvarligSystem,
  hentInnsendteMeldeperioder,
  hentKommendeMeldeperiode,
} from 'lib/services/meldekortservice';
import { redirect } from 'next/navigation';

export default async function Page() {
  const ansvarligSystem = await hentAnsvarligSystem();

  if (ansvarligSystem === 'FELLES') {
    redirect('https://www.nav.no/nav.no-ressurser/lenker/selvbetjening/tjenester-pa-nav.no/send-meldekort');
  }

  const innsendteMeldeperioder = await hentInnsendteMeldeperioder();
  const kommendeMeldeperiode = await hentKommendeMeldeperiode();

  return (
    <Oversikt
      kommendeMeldeperiode={kommendeMeldeperiode}
      harInnsendteMeldeperioder={innsendteMeldeperioder.length > 0}
    />
  );
}
