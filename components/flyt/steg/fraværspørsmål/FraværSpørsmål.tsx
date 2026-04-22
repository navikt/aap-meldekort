'use client';

import { useTranslations } from 'next-intl';

import { BodyShort, Heading, List, Radio, ReadMore, VStack } from '@navikt/ds-react';
import { formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { UtfyllingResponse } from 'lib/types/types';
import { getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useForm, useWatch } from 'react-hook-form';
import { Form } from 'components/form/Form';
import { useGåTilSteg, useParamsMedType } from 'lib/utils/url';
import { useMellomlagring } from 'hooks/mellomlagreMeldekortHook';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { useEffect } from 'react';

interface Props {
  utfylling: UtfyllingResponse;
}

interface FormFields {
  harDuHattAvtalteAktiviteter: JaEllerNei;
  harDuHattFravær?: 'GJENNOMFØRT_AVTALT_AKTIVITET' | 'NEI_IKKE_GJENNOMFORT_AVTALT_AKTIVITET';
}

export const FraværSpørsmål = ({ utfylling }: Props) => {
  const t = useTranslations();
  const { referanse } = useParamsMedType();
  const { gåTilSteg } = useGåTilSteg();
  const { isLoading, løsStegOgGåTilNeste, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
  const { mellomlagreMeldekort, sistLagret } = useMellomlagring();
  const form = useForm<FormFields>({
    defaultValues: {
      harDuHattAvtalteAktiviteter: getJaNeiEllerUndefined(utfylling.tilstand.svar.harDuHattAvtalteAktiviteter),
      harDuHattFravær: utfylling.tilstand.svar.harDuHattFravær ?? undefined,
    },
    shouldUnregister: true,
  });

  const harDuAvtalteAktiviteterValue = useWatch({ control: form.control, name: 'harDuHattAvtalteAktiviteter' });
  const harDuHattFraværValue = useWatch({ control: form.control, name: 'harDuHattFravær' });

  useEffect(() => {
    if (harDuAvtalteAktiviteterValue !== null) {
      mellomlagreMeldekort({
        nyTilstand: {
          aktivtSteg: 'FRAVÆR_SPØRSMÅL',
          svar: {
            ...utfylling.tilstand.svar,
            harDuHattAvtalteAktiviteter: harDuAvtalteAktiviteterValue === JaEllerNei.Ja,
            harDuHattFravær: harDuHattFraværValue ?? undefined,
          },
        },
      });
    }
  }, [harDuAvtalteAktiviteterValue, harDuHattFraværValue]);

  const forrigeSteg = utfylling.tilstand.svar.harDuJobbet ? 'UTFYLLING' : 'SPØRSMÅL';

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);
  return (
    <Form
      forrigeStegOnClick={() => gåTilSteg(forrigeSteg)}
      sistLagret={sistLagret}
      onSubmit={form.handleSubmit(async (data) => {
        løsStegOgGåTilNeste({
          nyTilstand: {
            aktivtSteg: 'FRAVÆR_SPØRSMÅL',
            svar: {
              ...utfylling.tilstand.svar,
              harDuHattAvtalteAktiviteter: data.harDuHattAvtalteAktiviteter === JaEllerNei.Ja,
              harDuHattFravær: data.harDuHattFravær ?? undefined,
            },
          },
        });
      })}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <VStack gap={'space-32'}>
        <VStack gap={'space-8'}>
          <Heading level={'2'} size={'large'}>
            {t('client.steg.fraværspørsmål.heading')}
          </Heading>
          <BodyShort>
            {t('client.steg.fraværspørsmål.periode', {
              uker: hentUkeNummerForPeriode(fraDato, tilDato),
              periode: `${formaterDatoMedÅrForFrontend(fraDato)} - ${formaterDatoMedÅrForFrontend(tilDato)}`,
            })}
          </BodyShort>
        </VStack>
        <RadioGroupWrapper
          name={'harDuHattAvtalteAktiviteter'}
          control={form.control}
          size={'medium'}
          label={t('client.steg.fraværspørsmål.skjema.felter.harDuHattAvtalteAktiviteter.label')}
          rules={{ required: t('client.steg.fraværspørsmål.skjema.felter.harDuHattAvtalteAktiviteter.error') }}
        >
          <ReadMore header={t('client.steg.fraværspørsmål.skjema.felter.harDuHattAvtalteAktiviteter.readMore.title')}>
            <VStack gap={'space-8'}>
              <BodyShort>
                {t('client.steg.fraværspørsmål.skjema.felter.harDuHattAvtalteAktiviteter.readMore.innledning')}
              </BodyShort>
              <List>
                <List.Item>
                  {t('client.steg.fraværspørsmål.skjema.felter.harDuHattAvtalteAktiviteter.readMore.listItem1')}
                </List.Item>
                <List.Item>
                  {t('client.steg.fraværspørsmål.skjema.felter.harDuHattAvtalteAktiviteter.readMore.listItem2')}
                </List.Item>
                <List.Item>
                  {t('client.steg.fraværspørsmål.skjema.felter.harDuHattAvtalteAktiviteter.readMore.listItem3')}
                </List.Item>
              </List>
              <BodyShort>
                {t('client.steg.fraværspørsmål.skjema.felter.harDuHattAvtalteAktiviteter.readMore.unntak')}
              </BodyShort>
              <List>
                <List.Item>
                  {t('client.steg.fraværspørsmål.skjema.felter.harDuHattAvtalteAktiviteter.readMore.unntak1')}
                </List.Item>
                <List.Item>
                  {t('client.steg.fraværspørsmål.skjema.felter.harDuHattAvtalteAktiviteter.readMore.unntak2')}
                </List.Item>
              </List>
            </VStack>
          </ReadMore>
          <Radio value={JaEllerNei.Ja}>Ja</Radio>
          <Radio value={JaEllerNei.Nei}>Nei</Radio>
        </RadioGroupWrapper>
        {harDuAvtalteAktiviteterValue === JaEllerNei.Ja && (
          <RadioGroupWrapper
            name={'harDuHattFravær'}
            control={form.control}
            size={'medium'}
            label={t('client.steg.fraværspørsmål.skjema.felter.harDuHattFravær.label')}
            rules={{ required: t('client.steg.fraværspørsmål.skjema.felter.harDuHattFravær.error') }}
          >
            <Radio value={'NEI_IKKE_GJENNOMFORT_AVTALT_AKTIVITET'}>Ja</Radio>
            <Radio value={'GJENNOMFØRT_AVTALT_AKTIVITET'}>Nei</Radio>
          </RadioGroupWrapper>
        )}
      </VStack>
    </Form>
  );
};
