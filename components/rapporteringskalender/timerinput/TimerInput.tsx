import styles from 'components/rapporteringskalender/timerinput/TimerInput.module.css';
import { UseFormReturn } from 'react-hook-form';
import { MeldepliktFormFields } from 'components/rapporteringskalender/Rapporteringskalender';
import { TextFieldWrapper } from '@navikt/aap-felles-react';

interface Props {
  index: number;
  form: UseFormReturn<MeldepliktFormFields>;
}

export const TimerInput = ({ index, form }: Props) => {
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
