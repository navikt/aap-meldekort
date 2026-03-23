import { Box, Button, Dialog, ErrorMessage, Radio, VStack } from '@navikt/ds-react';
import { FraværFormFields } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { UseFieldArrayAppend, useForm, useWatch } from 'react-hook-form';
import { Fravær, UtfyllingResponse } from 'lib/types/types';
import { DateWrapper } from 'components/datewrapper/DateWrapper';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import styles from './RegistrerFraværDialog.module.css';

interface Props {
  utfylling: UtfyllingResponse;
  leggTilFravær: UseFieldArrayAppend<FraværFormFields, 'dager'>;
  visDialog: boolean;
  setVisDialog: (isOpen: boolean) => void;
  disabledDays?: Date[];
}

interface FormFields {
  dato: Date;
  typeFravær: NonNullable<Fravær> | 'OMSORG'; // vi trenger en ekstra option for å kunne håndtere nøstede radio-valg
}

export const RegistrerFraværDialog = ({ utfylling, leggTilFravær, visDialog, setVisDialog, disabledDays }: Props) => {
  const t = useTranslations();
  const form = useForm<FormFields>({
    defaultValues: {
      dato: undefined,
      typeFravær: undefined,
    },
  });

  const [fraværUndervalgFeilmelding, setFraværUndervalgFeilmelding] = useState(false);

  const utfyllingsdager = utfylling.tilstand.svar.dager;

  const visUndervalg = [
    'OMSORG',
    'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN',
    'OMSORG_PLEIE_I_HJEMMET_AV_NÆR_PÅRØRENDE',
    'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS',
    'OMSORG_ANNEN_STERK_GRUNN',
  ].includes(useWatch({ control: form.control, name: 'typeFravær' }));

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
              setFraværUndervalgFeilmelding(false);
              const fravær = validerFravær(data);
              if (fravær) {
                leggTilFravær({ dato: data.dato, fravær: fravær });
                setVisDialog(false);
                form.reset();
              } else {
                setFraværUndervalgFeilmelding(true);
              }
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
                defaultMonth={new Date(utfyllingsdager[0].dato)}
              />
              <RadioGroupWrapper
                size={'medium'}
                control={form.control}
                name={'typeFravær'}
                label={t('client.steg.fraværutfylling.dialog.grunn.label')}
                rules={{ required: t('client.steg.fraværutfylling.dialog.grunn.error') }}
              >
                <Radio
                  value={'SYKDOM_ELLER_SKADE'}
                  description={t('client.steg.fraværutfylling.dialog.grunn.grunner.sykdomSkade.description')}
                >
                  {t('client.steg.fraværutfylling.dialog.grunn.grunner.sykdomSkade.label')}
                </Radio>
                <Radio
                  value={'OMSORG'}
                  description={t('client.steg.fraværutfylling.dialog.grunn.grunner.omsorg.description')}
                >
                  {t('client.steg.fraværutfylling.dialog.grunn.grunner.omsorg.label')}
                </Radio>
                {visUndervalg && (
                  <Box
                    paddingInline={'space-24 space-0'}
                    className={fraværUndervalgFeilmelding ? styles.feil : undefined}
                  >
                    <Radio value={'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN'}>
                      {t('client.steg.fraværutfylling.dialog.grunn.grunner.oppfølgingAvBarn.label')}
                    </Radio>
                    <Radio value={'OMSORG_PLEIE_I_HJEMMET_AV_NÆR_PÅRØRENDE'}>
                      {t('client.steg.fraværutfylling.dialog.grunn.grunner.omsorgPleieIHjemmet.label')}
                    </Radio>
                    <Radio value={'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS'}>
                      {t('client.steg.fraværutfylling.dialog.grunn.grunner.dødsfall.label')}
                    </Radio>
                    <Radio value={'OMSORG_ANNEN_STERK_GRUNN'}>
                      {t('client.steg.fraværutfylling.dialog.grunn.grunner.omsorgAnnenSterkGrunn.label')}
                    </Radio>
                  </Box>
                )}
                <Radio
                  value={'ANNEN'}
                  description={t('client.steg.fraværutfylling.dialog.grunn.grunner.annen.description')}
                >
                  {t('client.steg.fraværutfylling.dialog.grunn.grunner.annen.label')}
                </Radio>
              </RadioGroupWrapper>
              {fraværUndervalgFeilmelding && <ErrorMessage showIcon>Du må velge fraværsgrunn</ErrorMessage>}
            </VStack>
          </form>
        </Dialog.Body>
        <Dialog.Footer className={styles.modalKnapper}>
          <Button variant={'primary'} form="skjemaet">
            {t('client.steg.fraværutfylling.dialog.bekreft')}
          </Button>
          <Dialog.CloseTrigger>
            <Button variant={'secondary'} type={'button'}>
              {t('client.steg.fraværutfylling.dialog.avbryt')}
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};

function validerFravær(formFields: FormFields): NonNullable<Fravær> | undefined {
  if (formFields.typeFravær === 'OMSORG') {
    return undefined;
  }
  return formFields.typeFravær;
}
