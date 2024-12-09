import { PeriodeMedDataFetching } from 'components/steg/periode/PeriodeMedDataFetching';
import { UtfyllingMedDataFetching } from 'components/steg/utfylling/UtfyllingMedDataFetching';
import { Steg } from 'lib/types/types';
import { IntroduksjonMedDataFetching } from 'components/steg/introduksjon/IntroduksjonMedDataFetching';
import { OppsummeringMedDataFetching } from 'components/steg/oppsummering/OppsummeringMedDataFetching';

interface Props {
  params: Promise<{
    referanse: string;
    aktivtSteg: string;
  }>;
}
const AktivtStegPage = async (props: Props) => {
  const params = await props.params;
  const aktivtSteg = decodeURI(params.aktivtSteg) as Steg;
  const referanse = params.referanse;

  return (
    <div>
      {aktivtSteg === 'BEKREFT_SVARER_ÆRLIG' && <IntroduksjonMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'JOBBET_I_MELDEPERIODEN' && <PeriodeMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'TIMER_ARBEIDET' && <UtfyllingMedDataFetching referanse={referanse} />}
      {aktivtSteg === 'KVITTERING' && <OppsummeringMedDataFetching referanse={referanse} />}
    </div>
  );
};

export default AktivtStegPage;
