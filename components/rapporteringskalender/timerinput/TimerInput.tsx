import styles from 'components/rapporteringskalender/timerinput/TimerInput.module.css';
import { TextFieldWrapper } from '@navikt/aap-felles-react';
import { useFormContext } from 'react-hook-form';

interface Props {
  index: number;
  harError: boolean;
  label: string;
  isSmallScreen: boolean;
}

export const TimerInput = ({ index, harError, label, isSmallScreen }: Props) => {
  const form = useFormContext();
  const harErrorClassName = harError ? styles.error : '';

  return (
    <div className={isSmallScreen ? '' : styles.inputlargescreen}>
      <TextFieldWrapper
        control={form.control}
        name={`dager.${index}.timer`}
        type={'text'}
        size={'medium'}
        label={label}
        hideLabel
        className={harErrorClassName}
      />
    </div>
  );
};
