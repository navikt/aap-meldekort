import { TimerInput } from 'components/rapporteringskalender/timerinput/TimerInput';
import { FieldArrayWithIndex } from 'components/rapporteringskalender/Rapporteringskalender';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale/nb';

import { BodyShort } from '@navikt/ds-react';

import styles from './UkeRad.module.css';
import { UtfyllingAvTimerError } from 'components/flyt/innsending/steg/timerarbeidet/Utfylling';

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
            <BodyShort key={index} size={'medium'} aria-hidden>
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
            label={format(new Date(field.dag), 'eeee do MMMM', { locale: nb })}
          />
        ))}
      </div>
    </div>
  );
};
