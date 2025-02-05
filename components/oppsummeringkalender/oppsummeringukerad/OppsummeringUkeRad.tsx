import { format } from 'date-fns';
import { BodyShort } from '@navikt/ds-react';
import { Dag } from 'components/oppsummeringkalender/OppsummeringKalender';

import styles from './OppsummeringUkeRad.module.css';
import { formaterUkedag } from 'components/rapporteringskalender/ukerapportering/UkeRapportering';

interface Props {
  felterIUken: Dag[];
}

export const OppsummeringUkeRad = ({ felterIUken }: Props) => {
  return (
    <div className={styles.rad}>
      {felterIUken.map((field, index) => {
        const dagINummer = format(new Date(field.dag), 'd');
        return (
          <div className={styles.dag} key={index}>
            <BodyShort size={'small'} aria-hidden weight={'semibold'}>
              {formaterUkedag(field.dag.toString())} {dagINummer}.
            </BodyShort>
            <div className={`${styles.timer} ${field.timer > 0 && styles.harTimer}`}>
              <BodyShort>{`${field.timer}t`}</BodyShort>
            </div>
          </div>
        );
      })}
    </div>
  );
};
