import { TimerInput } from 'components/rapporteringskalender/timerinput/TimerInput';
import { FieldArrayWithIndex } from 'components/rapporteringskalender/Rapporteringskalender';
import { format } from 'date-fns';
import { BodyShort } from '@navikt/ds-react';

import styles from './UkeRad.module.css';
import { UtfyllingAvTimerError } from 'components/steg/timerarbeidet/Utfylling';

interface Props {
  felterIUken: FieldArrayWithIndex[];
  errors: UtfyllingAvTimerError[];
}

export const UkeRad = ({ felterIUken, errors }: Props) => {
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
      <div className={styles.timerinput}>
        {felterIUken.map((field) => (
          <TimerInput
            key={field.id}
            index={field.index}
            harError={Boolean(errors.find((error) => error.index === field.index)?.harError)}
          />
        ))}
      </div>
    </div>
  );
};
