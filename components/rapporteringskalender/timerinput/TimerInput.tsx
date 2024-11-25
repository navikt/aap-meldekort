import styles from 'components/rapporteringskalender/timerinput/TimerInput.module.css';
import { TextFieldWrapper } from '@navikt/aap-felles-react';
import { useFormContext } from 'react-hook-form';

interface Props {
  index: number;
}

export const TimerInput = ({ index }: Props) => {
  const form = useFormContext();
  const textfieldClassName = form.watch(`dager.${index}.timer`) ? styles.inputmedverdi : styles.inpututenverdi;

  return (
    <div className={`${textfieldClassName} ${styles.input}`}>
      <TextFieldWrapper
        control={form.control}
        name={`dager.${index}.timer`}
        type={'text'}
        label={`dager.${index}.timer`}
        hideLabel
        className={textfieldClassName}
      />
    </div>
  );
};
