import { OppsummeringRad } from 'components/oppsummeringrad/OppsummeringRad';

interface Props {
  timer: number;
  className?: string;
}

const antallTimerIMeldepliktPerioden = 37.5 * 2;

export const OppsummeringTimer = ({ timer }: Props) => {
  const antallTimerIProsent = Math.round((timer / antallTimerIMeldepliktPerioden) * 100);

  return (
    <OppsummeringRad
      heading={'Sammenlagt for perioden'}
      label={'Jobb'}
      value={`${timer} timer (${antallTimerIProsent})`}
      backgroundColor={'blue'}
    />
  );
};
