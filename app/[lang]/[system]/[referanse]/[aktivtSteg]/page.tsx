import { PeriodeMedDataFetching } from 'components/steg/periode/PeriodeMedDataFetching';
import { UtfyllingMedDataFetching } from 'components/steg/utfylling/UtfyllingMedDataFetching';
import { Steg } from 'lib/types/types';
import { IntroduksjonMedDataFetching } from 'components/steg/introduksjon/IntroduksjonMedDataFetching';
import { KvitteringMedDataFetching } from 'components/steg/kvittering/KvitteringMedDataFetching';
import { Alert } from '@navikt/ds-react';
import { hentMeldekort } from 'lib/services/meldekortservice';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{
    referanse: string;
    aktivtSteg: string;
    system: string;
  }>;
}
const AktivtStegPage = async (props: Props) => {
  const params = await props.params;
  const aktivtSteg = decodeURI(params.aktivtSteg) as Steg;
  const referanse = params.referanse;
  const meldeperiode = await hentMeldekort(referanse);

  function skalRedirecteTilAktivtSteg() {
    const steg: Steg[] = ['BEKREFT_SVARER_ÆRLIG', 'JOBBET_I_MELDEPERIODEN', 'TIMER_ARBEIDET', 'KVITTERING'];

    const aktivtStegIndex = steg.indexOf(aktivtSteg);
    const backendStegIndex = steg.indexOf(meldeperiode.steg);

    return aktivtStegIndex === -1 || aktivtStegIndex > backendStegIndex;
  }

  if (skalRedirecteTilAktivtSteg()) {
    redirect(`/${params.system}/${referanse}/${meldeperiode.steg}`);
  }

  return (
    <div>
      <Alert variant={'info'} style={{ marginBottom: '1rem' }}>
        AAP-meldekort er under utvikling og den vil til tider være utilgjengelig for testing.
      </Alert>
      {aktivtSteg === 'BEKREFT_SVARER_ÆRLIG' && <IntroduksjonMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'JOBBET_I_MELDEPERIODEN' && <PeriodeMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'TIMER_ARBEIDET' && <UtfyllingMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'KVITTERING' && <KvitteringMedDataFetching referanse={referanse} />}
    </div>
  );
};

export default AktivtStegPage;
