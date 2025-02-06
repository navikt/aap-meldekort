import { KvitteringInnsending } from 'components/flyt/innsending/steg/kvittering/KvitteringInnsending';
import { hentKommendeMeldekort, hentMeldekort } from 'lib/services/meldekortservice';

interface Props {
  referanse: string;
}

export const KvitteringInnsendingMedDataFetching = async ({ referanse }: Props) => {
  const meldekort = await hentMeldekort(referanse);
  const kommendeMeldekort = await hentKommendeMeldekort();

  return <KvitteringInnsending meldekort={meldekort} kommendeMeldekort={kommendeMeldekort} />;
};
