'use client';

import { Form } from 'components/form/Form';
import { getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { BodyShort, Heading, Radio, VStack } from '@navikt/ds-react';
import { formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { FraværSvar, UtfyllingResponse } from 'lib/types/types';
import { InnsendingType, useGåTilSteg, useParamsMedType } from 'lib/utils/url';
import { useMellomlagring } from 'hooks/mellomlagreMeldekortHook';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { isSameDay } from 'date-fns';

interface Props {
  utfylling: UtfyllingResponse;
}

interface FormFields {
  harDuJobbet: JaEllerNei;
  harDuGjennomførtAvtaltAktivitet: NonNullable<FraværSvar>;
}

export const Spørsmål = ({ utfylling }: Props) => {
  const t = useTranslations();
  const { referanse, innsendingtype } = useParamsMedType();
  const { gåTilSteg } = useGåTilSteg();
  const { isLoading, løsStegOgGåTilNeste, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
  const { mellomlagreMeldekort, sistLagret } = useMellomlagring();

  const brukV2Flyt =
    utfylling.metadata.flytNavn === 'AAP_KORRIGERING_FLYT_V2' || utfylling.metadata.flytNavn === 'AAP_FLYT_V2';

  const form = useForm<FormFields>({
    defaultValues: {
      harDuJobbet: getJaNeiEllerUndefined(utfylling.tilstand.svar.harDuJobbet),
      harDuGjennomførtAvtaltAktivitet: utfylling.tilstand.svar.harDuGjennomførtAvtaltAktivitet || undefined,
    },
  });

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  const harDuJobbetValue = useWatch({ control: form.control, name: 'harDuJobbet' });
  const harDuGjennomførtAvtaltAktivitetValue = useWatch({
    control: form.control,
    name: 'harDuGjennomførtAvtaltAktivitet',
  });

  useEffect(() => {
    if (harDuJobbetValue !== null) {
      mellomlagreMeldekort({
        nyTilstand: {
          aktivtSteg: 'SPØRSMÅL',
          svar: {
            ...utfylling.tilstand.svar,
            harDuJobbet: harDuJobbetValue === JaEllerNei.Ja,
            harDuGjennomførtAvtaltAktivitet: harDuGjennomførtAvtaltAktivitetValue,
          },
        },
      });
    }
  }, [harDuJobbetValue, harDuGjennomførtAvtaltAktivitetValue]);

  return (
    <Form
      forrigeStegOnClick={innsendingtype === InnsendingType.INNSENDING ? () => gåTilSteg('INTRODUKSJON') : undefined}
      sistLagret={sistLagret}
      onSubmit={form.handleSubmit(async (data) => {
        løsStegOgGåTilNeste({
          nyTilstand: {
            aktivtSteg: 'SPØRSMÅL',
            svar: {
              ...utfylling.tilstand.svar,
              dager: utfylling.tilstand.svar.dager.map((dag) => {
                return {
                  dato: dag.dato,
                  timerArbeidet: data.harDuJobbet === JaEllerNei.Nei ? 0 : dag.timerArbeidet,
                  fravær: utfylling.tilstand.svar.dager.find((tilstandDag) => isSameDay(tilstandDag.dato, dag.dato))
                    ?.fravær,
                };
              }),
              harDuJobbet: data.harDuJobbet === JaEllerNei.Ja,
              harDuGjennomførtAvtaltAktivitet: data.harDuGjennomførtAvtaltAktivitet,
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
            {innsendingtype === InnsendingType.INNSENDING
              ? t('client.steg.spørsmål.innsending.heading')
              : t('client.steg.spørsmål.korrigering.heading')}
          </Heading>
          <BodyShort>
            {t('client.steg.spørsmål.periode', {
              uker: hentUkeNummerForPeriode(fraDato, tilDato),
              periode: `${formaterDatoMedÅrForFrontend(fraDato)} - ${formaterDatoMedÅrForFrontend(tilDato)}`,
            })}
          </BodyShort>
        </VStack>
        <RadioGroupWrapper
          name={'harDuJobbet'}
          control={form.control}
          label={t('client.steg.spørsmål.skjema.felter.harDuArbeidet.label')}
          size={'medium'}
          rules={{ required: t('client.steg.spørsmål.skjema.felter.harDuArbeidet.error') }}
        >
          <Radio value={JaEllerNei.Ja}>Ja</Radio>
          <Radio value={JaEllerNei.Nei}>Nei</Radio>
        </RadioGroupWrapper>
        {brukV2Flyt && (
          <RadioGroupWrapper
            name={'harDuGjennomførtAvtaltAktivitet'}
            control={form.control}
            label={t('client.steg.fraværspørsmål.harDuGjennomførtAvtaltAktivitet.label')}
            size={'medium'}
            rules={{ required: t('client.steg.fraværspørsmål.harDuGjennomførtAvtaltAktivitet.error') }}
          >
            <Radio value={'GJENNOMFØRT_AVTALT_AKTIVITET'}>
              {t('client.fraværFraAvtaltAktivitet.harDuGjennomførtAvtaltAktivitet.valg.gjennomførtAvtaltAktivitet')}
            </Radio>
            <Radio value={'NEI_IKKE_GJENNOMFORT_AVTALT_AKTIVITET'}>
              {t(
                'client.fraværFraAvtaltAktivitet.harDuGjennomførtAvtaltAktivitet.valg.neiIkkeGjennomførtAvtaltAktivitet'
              )}
            </Radio>
            <Radio value={'INGEN_AVTALTE_AKTIVITETER'}>
              {t('client.fraværFraAvtaltAktivitet.harDuGjennomførtAvtaltAktivitet.valg.ingenAvtalteAktiviteter')}
            </Radio>
          </RadioGroupWrapper>
        )}
      </VStack>
    </Form>
  );
};
