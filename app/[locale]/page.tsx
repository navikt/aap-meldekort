import { Oversikt } from 'components/sider/oversikt/Oversikt';
import {
  hentAnsvarligSystem,
  hentInnsendteMeldeperioder,
  hentKommendeMeldeperiode,
} from 'lib/services/meldekortservice';
import { redirect } from 'next/navigation';
import { isError, isSuccess } from 'lib/utils/api';
import { Alert } from '@navikt/ds-react';

export default async function Page() {
  const ansvarligSystem = await hentAnsvarligSystem();

  if (isSuccess(ansvarligSystem) && ansvarligSystem.data === 'FELLES') {
    redirect('https://www.nav.no/nav.no-ressurser/lenker/selvbetjening/tjenester-pa-nav.no/send-meldekort');
  }

  const innsendteMeldeperioder = await hentInnsendteMeldeperioder();
  const kommendeMeldeperiode = await hentKommendeMeldeperiode();

  if (isError(innsendteMeldeperioder) || isError(kommendeMeldeperiode)) {
    return <Alert variant="error">En ukjent feil oppsto</Alert>;
  }

  return (
    <Oversikt
      kommendeMeldeperiode={kommendeMeldeperiode.data}
      harInnsendteMeldeperioder={innsendteMeldeperioder.data.length > 0}
    />
  );
}
