import { TimerInput } from 'components/rapporteringskalender/timerinput/TimerInput';
import { FieldArrayWithIndex } from 'components/rapporteringskalender/Rapporteringskalender';
import { format } from 'date-fns';
import { BodyShort } from '@navikt/ds-react';

import styles from './UkeRad.module.css';

interface Props {
  felterIUken: FieldArrayWithIndex[];
  readOnly: boolean;
}

export const UkeRad = ({ felterIUken, readOnly }: Props) => {
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
      <div className={readOnly ? styles.timerinput : styles.timertekst}>
        {felterIUken.map((field) =>
          readOnly ? (
            <TimerInput key={field.id} index={field.index} />
          ) : (
            <BodyShort key={field.id}>{field.timer ? field.timer : 0}</BodyShort>
          )
        )}
      </div>
    </div>
  );
};
