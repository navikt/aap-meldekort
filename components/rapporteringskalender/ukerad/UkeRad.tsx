import { TimerInput } from 'components/rapporteringskalender/timerinput/TimerInput';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { MeldepliktFormFields } from 'components/rapporteringskalender/Rapporteringskalender';
import { format } from 'date-fns';
import { BodyShort } from '@navikt/ds-react';

import styles from './UkeRad.module.css';

interface Props {
  felterIUken: FieldArrayWithId<MeldepliktFormFields>[];
  form: UseFormReturn<MeldepliktFormFields>;
}

export const UkeRad = ({ felterIUken, form }: Props) => {
  return (
    <div className={styles.rad}>
      <div className={styles.ukeheading}>
        {felterIUken.map((field, index) => {
          const dagINummer = format(new Date(field.dag), 'd');
          return (
            <BodyShort key={index} size={'medium'}>
              {dagINummer}.
            </BodyShort>
          );
        })}
      </div>
      <div className={styles.inputtimer}>
        {felterIUken.map((field) => (
          <TimerInput key={field.id} index={field.index} form={form} />
        ))}
      </div>
    </div>
  );
};
