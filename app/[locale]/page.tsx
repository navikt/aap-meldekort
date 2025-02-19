import { Oversikt } from 'components/sider/oversikt/Oversikt';
import {
  hentAnsvarligSystem,
  hentInnsendteMeldeperioder,
  hentKommendeMeldeperiode,
} from 'lib/services/meldekortservice';

export default async function Page() {
  const innsendteMeldeperioder = await hentInnsendteMeldeperioder();
  const kommendeMeldeperiode = await hentKommendeMeldeperiode();
  const ansvarligSystem = await hentAnsvarligSystem();

  console.log('innsendte meldeperioder', innsendteMeldeperioder);
  console.log('kommende meldeperiode', kommendeMeldeperiode);
  console.log('ansvarlig system', ansvarligSystem);

  return (
    <Oversikt kommendeMeldeperiode={kommendeMeldeperiode} harInnsendteMeldeperioder={innsendteMeldeperioder.length > 0} />
  );
}
