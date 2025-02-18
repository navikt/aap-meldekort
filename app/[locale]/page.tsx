import { Oversikt } from 'components/sider/oversikt/Oversikt';
import { hentInnsendteMeldekort, hentKommendeMeldekort } from 'lib/services/meldekortservice';

export default async function Page() {
  const innsendteMeldekort = await hentInnsendteMeldekort();
  const kommendeMeldekort = await hentKommendeMeldekort();

  return <Oversikt kommendeMeldekort={kommendeMeldekort} harInnsendteMeldekort={innsendteMeldekort.length > 0} />;
}
