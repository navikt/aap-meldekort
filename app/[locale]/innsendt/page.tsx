import { InnsendteMeldekort } from 'components/sider/innsendtemeldekort/InnsendteMeldekort';
import { hentInnsendteMeldeperioder } from 'lib/services/meldekortservice';
import { isError } from 'lib/utils/api';
import { Alert } from '@navikt/ds-react';

export default async function InnsendtPage() {
  const innsendteMeldekort = await hentInnsendteMeldeperioder();

  if (isError(innsendteMeldekort)) {
    return <Alert variant="error">Kunne ikke hente innsendte meldekort</Alert>;
  }

  return <InnsendteMeldekort innsendteMeldeperioder={innsendteMeldekort.data} />;
}
