import { PeriodeMedDataFetching } from 'components/steg/periode/PeriodeMedDataFetching';
import { UtfyllingMedDataFetching } from 'components/steg/utfylling/UtfyllingMedDataFetching';

interface Props {
  params: Promise<{
    referanse: string;
    aktivtSteg: string;
  }>;
}

type Steg = 'PERIODE' | 'UTFYLLING';

const AktivtStegPage = async (props: Props) => {
  const params = await props.params;
  const aktivtSteg = params.aktivtSteg as Steg;

  return (
    <div>
      {aktivtSteg === 'PERIODE' && <PeriodeMedDataFetching />}
      {aktivtSteg === 'UTFYLLING' && <UtfyllingMedDataFetching />}
    </div>
  );
};

export default AktivtStegPage;
