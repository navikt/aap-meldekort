import { Oversikt } from 'components/oversikt/Oversikt';
import { hentKommendeMeldekort } from 'lib/services/meldekortservice';

export default async function Page() {
  const kommendeMeldekort = await hentKommendeMeldekort();

  return <Oversikt kommendeMeldekort={kommendeMeldekort} />;
}
