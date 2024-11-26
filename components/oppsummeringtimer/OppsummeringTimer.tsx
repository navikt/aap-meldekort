import { BodyShort, Label } from '@navikt/ds-react';

import styles from 'components/oppsummeringtimer/OppsummeringTimer.module.css';

interface Props {
  timer: number;
}

const antallTimerIMeldepliktPerioden = 37.5 * 2;

export const OppsummeringTimer = ({ timer }: Props) => {
  const antallTimerIProsent = Math.round((timer / antallTimerIMeldepliktPerioden) * 100);

  return (
    <div className={styles.oppsummeringtimer}>
      <BodyShort size={'small'} className={styles.heading}>
        Sammenlagt for perioden
      </BodyShort>
      <div className={styles.timer}>
        <Label size={'medium'}>Jobb</Label>
        <BodyShort size={'medium'}>
          {timer} timer ({antallTimerIProsent}%)
        </BodyShort>
      </div>
    </div>
  );
};
