import { Button, Dialog, Radio } from '@navikt/ds-react';
import { FraværFormFields } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { UseFieldArrayAppend, useForm } from 'react-hook-form';
import { Fravær, UtfyllingResponse } from 'lib/types/types';
import { DateWrapper } from 'components/datewrapper/DateWrapper';
import { useEffect } from 'react';

interface Props {
  utfylling: UtfyllingResponse;
  leggTilFravær: UseFieldArrayAppend<FraværFormFields, 'dager'>;
  visDialog: boolean;
  setVisDialog: (isOpen: boolean) => void;
}

interface FormFields {
  dato: Date;
  typeFravær: Fravær;
}

export const RegistrerFraværDialog = ({ utfylling, leggTilFravær, visDialog, setVisDialog }: Props) => {
  const form = useForm<FormFields>({
    defaultValues: {
      dato: undefined,
      typeFravær: undefined,
    },
  });

  const fraværsgrunner = [
    { value: 'SYKDOM_ELLER_SKADE', label: 'SYKDOM_ELLER_SKADE' },
    { value: 'OMSORG_ANNEN_STERK_GRUNN', label: 'OMSORG_ANNEN_STERK_GRUNN' },
  ];

  // TODO Finnes det bedre måter?
  useEffect(() => {
    form.reset();
  }, [form, visDialog]);

  const utfyllingsdager = utfylling.tilstand.svar.dager;

  return (
    <Dialog open={visDialog} onOpenChange={setVisDialog}>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>Legg til dag</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <form
            id="skjemaet"
            onSubmit={form.handleSubmit((data) => {
              leggTilFravær({ dato: data.dato, fravær: data.typeFravær });
              setVisDialog(false);
              form.reset();
            })}
          >
            <DateWrapper
              name={'dato'}
              control={form.control}
              label={'Hvilken dag var du borte?'}
              rules={{ required: 'Du må si hvilken dag du var borte...' }}
              fromDate={new Date(utfyllingsdager[0].dato)}
              toDate={new Date(utfyllingsdager[utfyllingsdager.length - 1].dato)}
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
  );
};
