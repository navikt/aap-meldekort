import styles from 'components/rapporteringskalender/timerinput/TimerInput.module.css';
import { TextFieldWrapper } from '@navikt/aap-felles-react';
import { useFormContext } from 'react-hook-form';
import {
  erDetFørtTimerOgAvhuketFeriePåSammeDag,
  erGyldigTimer,
} from 'components/flyt/innsending/steg/utfylling/Utfylling';

interface Props {
  index: number;
  // harError: boolean;
  label: string;
  isSmallScreen: boolean;
}

export const TimerInput = ({ index, label, isSmallScreen }: Props) => {
  const form = useFormContext();
  // const harErrorClassName = harError ? styles.error : '';

  return (
    <div className={isSmallScreen ? '' : styles.inputlargescreen}>
      <TextFieldWrapper
        control={form.control}
        name={`dager.${index}.timer`}
        type={'text'}
        size={'medium'}
        label={label}
        // className={harErrorClassName}
        rules={{
          validate: (value, formValues) => {
            if (!erGyldigTimer(value)) {
              return 'Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer';
            }

            if (erDetFørtTimerOgAvhuketFeriePåSammeDag(formValues.dager[index])) {
              return 'Du kan ikke angi både arbeid og ferie på samme dag.';
            }
          },
        }}
      />
    </div>
  );
};
