import { OppsummeringRad } from 'components/oppsummeringrad/OppsummeringRad';
import { regnUtProsent } from 'lib/utils/meldekort';

interface Props {
  timer: number;
}

export const OppsummeringTimer = ({ timer }: Props) => {
  const antallTimerIProsent = regnUtProsent(timer);

  return <OppsummeringRad label={'Sammenlagt for perioden'} value={`${timer} timer (${antallTimerIProsent}%)`} />;
};
