import { Button, Dialog, Radio } from '@navikt/ds-react';
import { FraværFormFields } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { TextFieldWrapper } from 'components/textfieldwrapper/TextFieldWrapper';
import { useState } from 'react';
import { UseFieldArrayAppend, useForm } from 'react-hook-form';

interface Props {
  leggTilFravær: UseFieldArrayAppend<FraværFormFields, 'dager'>;
}

interface FormFields {
  dato: string;
  typeFravær: string;
}

export const RegistrerFraværDialog = ({ leggTilFravær }: Props) => {
  const [visDialog, setVisDialog] = useState<boolean>(false);

  const form = useForm<FormFields>({
    defaultValues: {
      dato: undefined,
      typeFravær: '',
    },
  });

  const fraværsgrunner = [
    { value: 'SJUK', label: 'Syk' },
    { value: 'TANNLEGE', label: 'Tannlege' },
  ];

  return (
    <>
      <Button type={'button'} variant={'secondary'} onClick={() => setVisDialog(true)}>
        Legg til dag
      </Button>
      <Dialog open={visDialog} onOpenChange={setVisDialog}>
        <Dialog.Popup>
          <Dialog.Header>
            <Dialog.Title>Legg til dag</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <form
              id="skjemaet"
              onSubmit={form.handleSubmit((data) => {
                leggTilFravær({ dag: new Date(), timer: '0', fravær: data.typeFravær });
                setVisDialog(false);
              })}
            >
              <TextFieldWrapper
                control={form.control}
                name="dato"
                label="Dato"
                id={'dato'}
                rules={{ required: 'Du må si hvilken dag du var borte...' }}
              />
              <RadioGroupWrapper control={form.control} name={'typeFravær'} rules={{ required: 'Du må velge grunn' }}>
                {fraværsgrunner.map((fraværsgrunn) => (
                  <Radio value={fraværsgrunn.value} key={fraværsgrunn.value}>
                    {fraværsgrunn.label}
                  </Radio>
                ))}
              </RadioGroupWrapper>
            </form>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger>
              <Button variant={'secondary'} type={'button'}>
                Avbryt
              </Button>
            </Dialog.CloseTrigger>
            <Button variant={'primary'} form="skjemaet">
              Bekreft
            </Button>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog>
    </>
  );
};
