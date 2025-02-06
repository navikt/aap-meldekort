import { OppsummeringRad } from 'components/oppsummeringrad/OppsummeringRad';
import { regnUtProsent } from 'lib/utils/meldekort';

interface Props {
  timer: number;
}

export const OppsummeringTimer = ({ timer }: Props) => {
  const antallTimerIProsent = regnUtProsent(timer);

  return (
    <OppsummeringRad
      heading={'Sammenlagt for perioden'}
      label={'Jobb'}
      value={`${timer} timer (${antallTimerIProsent}%)`}
      backgroundColor={'blue'}
    />
  );
};
