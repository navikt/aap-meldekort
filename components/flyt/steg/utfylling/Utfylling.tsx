'use client';

import { Form } from 'components/form/Form';
import { UtfyllingKalender, utfyllingKalenderId } from 'components/utfyllingkalender/UtfyllingKalender';
import { BodyLong, BodyShort, ErrorSummary, Heading, Link, ReadMore, VStack } from '@navikt/ds-react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { UtfyllingResponse } from 'lib/types/types';
import { formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { InnsendingType, useGåTilSteg, useParamsMedType } from 'lib/utils/url';
import { useMellomlagring } from 'hooks/mellomlagreMeldekortHook';
import { useTranslations } from 'next-intl';

interface Props {
  utfylling: UtfyllingResponse;
}

export interface MeldepliktFormFields {
  dager: Dag[];
}

interface Dag {
  dag: string;
  timer: string | null;
}

export const Utfylling = ({ utfylling }: Props) => {
  const t = useTranslations();
  const { referanse, innsendingtype } = useParamsMedType();
  const { gåTilSteg } = useGåTilSteg();
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
  const { mellomlagreMeldekort, sistLagret } = useMellomlagring();
  const [skjemaError, setSkjemaError] = useState<string>();

  const form = useForm<MeldepliktFormFields>({
    defaultValues: {
      dager: utfylling.tilstand.svar.dager.map((dag) => ({
        dag: dag.dato,
        timer: dag.timerArbeidet == null || dag.timerArbeidet === 0 ? '' : dag.timerArbeidet.toString(),
      })),
    },
  });

  const feltErrors =
    form.formState.errors?.dager && Array.isArray(form.formState.errors.dager)
      ? form.formState.errors.dager
          .filter((dag) => dag?.timer)
          .map((dag) => ({
            ref: dag.timer.ref.name,
            message: dag.timer.message,
          }))
      : [];

  const feilmeldinger = skjemaError
    ? [...[{ ref: utfyllingKalenderId, message: skjemaError }], ...feltErrors]
    : feltErrors;

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  const dager = useWatch({ control: form.control, name: 'dager' });
  useEffect(() => {
    if (!manglerTimerPåArbeid(dager, true)) {
      setSkjemaError(undefined);
    }

    mellomlagreMeldekort({
      nyTilstand: {
        aktivtSteg: 'UTFYLLING',
        svar: {
          ...utfylling.tilstand.svar,
          dager: dager.map((dag) => ({
            dato: dag.dag,
            timerArbeidet: dag.timer ? Number(replaceCommasWithDots(dag.timer)) : null,
          })),
        },
      },
    });
  }, [dager]);

  return (
    <FormProvider {...form}>
      <Form
        forrigeStegOnClick={() => gåTilSteg('SPØRSMÅL')}
        nesteStegKnappTekst={'Neste'}
        sistLagret={sistLagret}
        onSubmit={form.handleSubmit(async (data) => {
          setSkjemaError(undefined);

          if (manglerTimerPåArbeid(data.dager, !!utfylling.tilstand.svar.harDuJobbet)) {
            setSkjemaError(t('client.steg.utfylling.skjema.ingenFørteTimer'));
          } else {
            løsStegOgGåTilNeste({
              nyTilstand: {
                aktivtSteg: 'UTFYLLING',
                svar: {
                  ...utfylling.tilstand.svar,
                  dager: data.dager.map((dag) => ({
                    dato: dag.dag,
                    timerArbeidet: dag.timer ? Number(replaceCommasWithDots(dag.timer)) : null,
                  })),
                },
              },
            });
          }
        })}
        isLoading={isLoading}
        errorMessage={errorMessage}
      >
        <VStack gap={'8'}>
          <VStack gap={'4'}>
            <VStack gap={'2'}>
              <Heading level={'2'} size={'large'}>
                {innsendingtype === InnsendingType.INNSENDING
                  ? t('client.steg.utfylling.innsending.heading')
                  : t('client.steg.utfylling.korrigering.heading')}
              </Heading>
              <BodyShort>
                {t('client.steg.spørsmål.periode', {
                  uker: hentUkeNummerForPeriode(fraDato, tilDato),
                  periode: `${formaterDatoMedÅrForFrontend(fraDato)} - ${formaterDatoMedÅrForFrontend(tilDato)}`,
                })}
              </BodyShort>
            </VStack>
            <BodyLong>{t('client.steg.utfylling.beskrivelse')}</BodyLong>
            <ReadMore header={t('client.steg.utfylling.readmore.label')}>
              <BodyShort>
                {t('client.steg.utfylling.readmore.content')}{' '}
                {t.rich('client.steg.utfylling.readmore.link', {
                  a: (chunks) => (
                    <Link href="https://www.nav.no/send-meldekort-aap#arbeid" target="_blank">
                      {chunks}
                    </Link>
                  ),
                })}
              </BodyShort>
            </ReadMore>
          </VStack>

          <UtfyllingKalender />

          {feilmeldinger.length > 0 && (
            <ErrorSummary>
              {feilmeldinger.map((error) => (
                <ErrorSummary.Item key={error.ref} href={`#${removeDots(error.ref)}`}>
                  {error.message}
                </ErrorSummary.Item>
              ))}
            </ErrorSummary>
          )}
        </VStack>
      </Form>
    </FormProvider>
  );
};

export function manglerTimerPåArbeid(dager: Dag[], harSvartJaPåArbeid: boolean): boolean {
  if (!harSvartJaPåArbeid) {
    return false;
  }

  return dager.filter((dag) => dag.timer).length === 0;
}

export function replaceCommasWithDots(input: string): string {
  return input.replace(/,/g, '.');
}

function removeDots(input: string): string {
  return input.replace(/\./g, '');
}
