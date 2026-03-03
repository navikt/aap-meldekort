import { Button, Dialog, Radio, VStack } from '@navikt/ds-react';
import { FraværFormFields } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { UseFieldArrayAppend, useForm } from 'react-hook-form';
import { Fravær, UtfyllingResponse } from 'lib/types/types';
import { DateWrapper } from 'components/datewrapper/DateWrapper';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

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

export interface ValuePair<Enum = string, LabelKey = string> {
  value: Enum;
  labelKey: LabelKey;
}

export const fraværsgrunner: ValuePair<NonNullable<Fravær>>[] = [
  { value: 'SYKDOM_ELLER_SKADE', labelKey: 'client.steg.fraværutfylling.dialog.grunn.grunner.sykdomSkade' },
  {
    value: 'OMSORG_ANNEN_STERK_GRUNN',
    labelKey: 'client.steg.fraværutfylling.dialog.grunn.grunner.omsorgAnnenSterkGrunn',
  },
  {
    value: 'OMSORG_PLEIE_I_HJEMMET_AV_NÆR_PÅRØRENDE',
    labelKey: 'client.steg.fraværutfylling.dialog.grunn.grunner.omsorgPleieIHjemmet',
  },
  {
    value: 'OMSORG_MEDDOMMER_ELLER_ANDRE_OFFENTLIGE_PLIKTER',
    labelKey: 'client.steg.fraværutfylling.dialog.grunn.grunner.meddommerEllerAndreOffentligePlikter',
  },
  {
    value: 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN',
    labelKey: 'client.steg.fraværutfylling.dialog.grunn.grunner.oppfølgingAvBarn',
  },
  {
    value: 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS',
    labelKey: 'client.steg.fraværutfylling.dialog.grunn.grunner.dødsfall',
  },
  { value: 'ANNEN', labelKey: 'client.steg.fraværutfylling.dialog.grunn.grunner.annen' },
];

export const RegistrerFraværDialog = ({ utfylling, leggTilFravær, visDialog, setVisDialog, disabledDays }: Props) => {
  const t = useTranslations();
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
          <Dialog.Title>{t('client.steg.fraværutfylling.dialog.title')}</Dialog.Title>
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
                label={t('client.steg.fraværutfylling.dialog.dato.label')}
                rules={{ required: t('client.steg.fraværutfylling.dialog.dato.error') }}
                fromDate={new Date(utfyllingsdager[0].dato)}
                toDate={new Date(utfyllingsdager[utfyllingsdager.length - 1].dato)}
                size={'medium'}
                disabledDays={disabledDays}
              />
              <RadioGroupWrapper
                size={'medium'}
                control={form.control}
                name={'typeFravær'}
                label={t('client.steg.fraværutfylling.dialog.grunn.label')}
                rules={{ required: t('client.steg.fraværutfylling.dialog.grunn.error') }}
              >
                {fraværsgrunner.map((fraværsgrunn) => (
                  <Radio value={fraværsgrunn.value} key={fraværsgrunn.value}>
                    {t(fraværsgrunn.labelKey)}
                  </Radio>
                ))}
              </RadioGroupWrapper>
            </VStack>
          </form>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button variant={'secondary'} type={'button'}>
              {t('client.steg.fraværutfylling.dialog.avbryt')}
            </Button>
          </Dialog.CloseTrigger>
          <Button variant={'primary'} form="skjemaet">
            {t('client.steg.fraværutfylling.dialog.bekreft')}
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
