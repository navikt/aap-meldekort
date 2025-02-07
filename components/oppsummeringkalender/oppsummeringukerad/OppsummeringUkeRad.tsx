import { format } from 'date-fns';
import { BodyShort } from '@navikt/ds-react';
import { Dag } from 'components/oppsummeringkalender/OppsummeringKalender';

import styles from './OppsummeringUkeRad.module.css';
import { formaterUkedag } from 'components/rapporteringskalender/ukerapportering/UkeRapportering';
import { nb } from 'date-fns/locale/nb';

interface Props {
  felterIUken: Dag[];
}

export const OppsummeringUkeRad = ({ felterIUken }: Props) => {
  return (
    <div className={styles.rad}>
      {felterIUken.map((field, index) => {
        const datoLabel = format(new Date(field.dag), 'eeee do MMMM', { locale: nb });
        const dagINummer = format(new Date(field.dag), 'd');
        return (
          <div className={styles.dag} key={index}>
            <div className={styles.sronly}>
              {datoLabel} {field.timer}t
            </div>
            <div aria-hidden>
              <BodyShort size={'small'} weight={'semibold'} aria-hidden>
                {formaterUkedag(field.dag.toString())} {dagINummer}.
              </BodyShort>
              <div className={`${styles.timer} ${field.timer > 0 && styles.harTimer}`}>
                <BodyShort>{`${field.timer}t`}</BodyShort>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
