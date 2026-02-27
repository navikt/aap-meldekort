import { Button, Dialog, Radio, VStack } from '@navikt/ds-react';
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
  disabledDays?: Date[];
}

interface FormFields {
  dato: Date;
  typeFravær: NonNullable<Fravær>;
}

export interface ValuePair<Enum = string> {
  value: Enum;
  label: string;
}

export const fraværsgrunner: ValuePair<NonNullable<Fravær>>[] = [
  { value: 'SYKDOM_ELLER_SKADE', label: 'Sykdom eller skade' },
  { value: 'OMSORG_ANNEN_STERK_GRUNN', label: 'Annen sterk grunn' },
  { value: 'OMSORG_PLEIE_I_HJEMMET_AV_NÆR_PÅRØRENDE', label: 'Pleie i hjemmet av nær pårørende' },
  { value: 'OMSORG_MEDDOMMER_ELLER_ANDRE_OFFENTLIGE_PLIKTER', label: 'Meddommer eller andre offentlige plikter' },
  {
    value: 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN',
    label: 'Første skoledag, tilvenning eller annen oppfølging av barn',
  },
  { value: 'ANNEN', label: 'Annen' },
  { value: 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS', label: 'Dødsfall i familie eller vennekrets' },
];

export const RegistrerFraværDialog = ({ utfylling, leggTilFravær, visDialog, setVisDialog, disabledDays }: Props) => {
  const form = useForm<FormFields>({
    defaultValues: {
      dato: undefined,
      typeFravær: undefined,
    },
  });

  const utfyllingsdager = utfylling.tilstand.svar.dager;

  // TODO Finnes det bedre måter?
  useEffect(() => {
    form.reset();
  }, [form, visDialog]);

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
            <VStack gap={'space-32'}>
              <DateWrapper
                name={'dato'}
                control={form.control}
                label={'Hvilken dag var du borte?'}
                rules={{ required: 'Du må si hvilken dag du var borte...' }}
                fromDate={new Date(utfyllingsdager[0].dato)}
                toDate={new Date(utfyllingsdager[utfyllingsdager.length - 1].dato)}
                size={'medium'}
                disabledDays={disabledDays}
              />
              <RadioGroupWrapper
                size={'medium'}
                control={form.control}
                name={'typeFravær'}
                label={'Hva var grunnen?'}
                rules={{ required: 'Du må velge grunn' }}
              >
                {fraværsgrunner.map((fraværsgrunn) => (
                  <Radio value={fraværsgrunn.value} key={fraværsgrunn.value}>
                    {fraværsgrunn.label}
                  </Radio>
                ))}
              </RadioGroupWrapper>
            </VStack>
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
