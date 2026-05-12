import { Oversikt } from 'components/sider/oversikt/Oversikt';
import {
  hentAnsvarligSystem,
  hentInnsendteMeldeperioder,
  hentKommendeMeldeperiode,
} from 'lib/services/meldekortservice';
import { redirect } from 'next/navigation';
import { isError, isSuccess } from 'lib/utils/api';
import { Alert } from '@navikt/ds-react';
import { isProduction } from 'lib/utils/environments';

export default async function Page() {
  const ansvarligSystem = await hentAnsvarligSystem();

  if (isSuccess(ansvarligSystem) && ansvarligSystem.data === 'FELLES') {
    if (!isProduction()) {
      redirect('https://meldekort-frontend-q2.intern.dev.nav.no/felles-meldekort');
    } else {
      redirect('https://www.nav.no/felles-meldekort');
    }
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
