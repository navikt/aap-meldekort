import { Oversikt } from 'components/sider/oversikt/Oversikt';
import { hentAnsvarligSystem, hentInnsendteMeldekort, hentKommendeMeldekort } from 'lib/services/meldekortservice';

export default async function Page() {
  // const innsendteMeldekort = await hentInnsendteMeldekort();
  // const kommendeMeldekort = await hentKommendeMeldekort();
  const ansvarligSystem = await hentAnsvarligSystem();

  console.log({ansvarligSystem})
  // return <Oversikt kommendeMeldekort={kommendeMeldekort} harInnsendteMeldekort={innsendteMeldekort.length > 0} />;
  return null
}
