import { Oversikt } from 'components/sider/oversikt/Oversikt';
import {
  hentAnsvarligSystemV2,
  hentInnsendteMeldeperioder,
  hentKommendeMeldeperiode,
} from 'lib/services/meldekortservice';
import { redirect } from 'next/navigation';
import { isError, isSuccess } from 'lib/utils/api';
import { Alert } from '@navikt/ds-react';
import { isProduction } from 'lib/utils/environments';
import { Visning } from 'lib/types/types';

async function hentVisning(): Promise<Visning> {
  const ansvarligSystem = await hentAnsvarligSystemV2();
  if (!isSuccess(ansvarligSystem)) {
    return { type: 'AAP' };
  }

  const { kelvin, arena } = ansvarligSystem.data;
  if (kelvin && arena) {
    return {
      type: 'BEGGE',
      kelvin,
      arena,
    };
  }
  if (kelvin) {
    return { type: 'AAP' };
  }
  if (arena) {
    return { type: 'FELLES' };
  }
  return { type: 'INGEN' };
}

export default async function Page() {
  const visning = await hentVisning();
  if (visning.type === 'FELLES') {
    if (!isProduction()) {
      redirect('https://meldekort-frontend-q2.intern.dev.nav.no/felles-meldekort');
    } else {
      redirect('https://www.nav.no/felles-meldekort');
    }
  }

  const [innsendteMeldeperioder, kommendeMeldeperiode] = await Promise.all([
    hentInnsendteMeldeperioder(),
    hentKommendeMeldeperiode(),
  ]);

  if (isError(innsendteMeldeperioder) || isError(kommendeMeldeperiode)) {
    return <Alert variant="error">En ukjent feil oppsto</Alert>;
  }

  return (
    <>
      <Oversikt
        kommendeMeldeperiode={kommendeMeldeperiode.data}
        harInnsendteMeldeperioder={innsendteMeldeperioder.data.length > 0}
        visning={visning}
      />
    </>
  );
}
