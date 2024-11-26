import { BodyShort, Label } from '@navikt/ds-react';

import styles from 'components/oppsummeringtimer/OppsummeringTimer.module.css';

interface Props {
  timer: number;
}

const antallTimerIMeldepliktPerioden = 37.5 * 2;

export const OppsummeringTimer = ({ timer }: Props) => {
  const antallTimerIProsent = Math.round((timer / antallTimerIMeldepliktPerioden) * 100);

  return (
    <div>
      <Label size={'small'}>Sammenlagt for perioden</Label>
      <div className={styles.timer}>
        <Label size={'medium'}>Jobb</Label>
        <BodyShort size={'medium'}>
          {timer} timer ({antallTimerIProsent}%)
        </BodyShort>
      </div>
    </div>
  );
};
