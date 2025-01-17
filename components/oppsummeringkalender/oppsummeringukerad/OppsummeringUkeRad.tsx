import { format } from 'date-fns';
import { BodyShort } from '@navikt/ds-react';
import { Dag } from 'components/oppsummeringkalender/OppsummeringKalender';

import styles from './OppsummeringUkeRad.module.css';

interface Props {
  felterIUken: Dag[];
}

export const OppsummeringUkeRad = ({ felterIUken }: Props) => {
  return (
    <div className={styles.rad}>
      <div className={styles.dagnummer}>
        {felterIUken.map((field, index) => {
          const dagINummer = format(new Date(field.dag), 'd');
          return (
            <BodyShort key={index} size={'medium'}>
              {dagINummer}.
            </BodyShort>
          );
        })}
      </div>
      <div className={styles.timertekst}>
        {felterIUken.map((field, index) => (
          <div className={`${styles.timer} ${field.timer > 0 && styles.harTimer}`} key={index}>
            <BodyShort>{field.timer}</BodyShort>
          </div>
        ))}
      </div>
    </div>
  );
};
