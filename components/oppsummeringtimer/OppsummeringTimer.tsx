import { BodyShort, Label } from '@navikt/ds-react';

import styles from 'components/oppsummeringtimer/OppsummeringTimer.module.css';

interface Props {
  timer: number;
  className?: string;
}

const antallTimerIMeldepliktPerioden = 37.5 * 2;

export const OppsummeringTimer = ({ timer, className }: Props) => {
  const antallTimerIProsent = Math.round((timer / antallTimerIMeldepliktPerioden) * 100);

  return (
    <div className={`${styles.oppsummeringtimer} ${className}`}>
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
