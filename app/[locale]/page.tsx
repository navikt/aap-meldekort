import { Oversikt } from 'components/sider/oversikt/Oversikt';
import {
  hentAnsvarligSystem,
  hentInnsendteMeldeperioder,
  hentKommendeMeldeperiode,
} from 'lib/services/meldekortservice';

export default async function Page() {
  const ansvarligSystem = await hentAnsvarligSystem();

  if (ansvarligSystem === 'FELLES') {
    //TODO Før vi går i produksjon så må vi redirecte til korrekt meldekortløsning basert på svaret vi får fra ansvarligSystem
    // redirect('https://www.nav.no/nav.no-ressurser/lenker/selvbetjening/tjenester-pa-nav.no/send-meldekort');
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
