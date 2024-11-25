import { TimerInput } from 'components/rapporteringskalender/timerinput/TimerInput';
import { useFormContext } from 'react-hook-form';
import { FieldArrayWithIndex } from 'components/rapporteringskalender/Rapporteringskalender';
import { format } from 'date-fns';
import { BodyShort } from '@navikt/ds-react';

import styles from './UkeRad.module.css';
import { MeldepliktFormFields } from 'components/steg/utfylling/Utfylling';

interface Props {
  felterIUken: FieldArrayWithIndex[];
}

export const UkeRad = ({ felterIUken }: Props) => {
  const form = useFormContext<MeldepliktFormFields>();

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
