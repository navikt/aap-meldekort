import styles from 'components/rapporteringskalender/timerinput/TimerInput.module.css';
import { TextFieldWrapper } from '@navikt/aap-felles-react';
import { useFormContext } from 'react-hook-form';

interface Props {
  index: number;
  harError: boolean;
  label: string;
}

export const TimerInput = ({ index, harError, label }: Props) => {
  const form = useFormContext();
  const textfieldClassName = form.watch(`dager.${index}.timer`) ? styles.inputmedverdi : styles.inpututenverdi;
  const harErrorClassName = harError ? 'navds-text-field--error' : '';

  return (
    <div className={styles.input}>
      <TextFieldWrapper
        control={form.control}
        name={`dager.${index}.timer`}
        type={'text'}
        size={"medium"}
        label={label}
        hideLabel
        className={`${textfieldClassName} ${harErrorClassName}`}
      />
    </div>
  );
};
