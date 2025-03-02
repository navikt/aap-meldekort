'use client';

import { Form } from 'components/form/Form';
import { Rapporteringskalender, rapporteringskalenderId } from 'components/rapporteringskalender/Rapporteringskalender';
import { BodyLong, BodyShort, ErrorSummary, Heading, ReadMore, VStack } from '@navikt/ds-react';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { UtfyllingResponse } from 'lib/types/types';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { InnsendingType, useGåTilSteg, useParamsMedType } from 'lib/utils/url';

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
  const { referanse, innsendingtype } = useParamsMedType();
  const { gåTilSteg } = useGåTilSteg();
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
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
    ? [...[{ ref: rapporteringskalenderId, message: skjemaError }], ...feltErrors]
    : feltErrors;

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  useEffect(() => {
    if (!manglerTimerPåArbeid(form.watch('dager'), true)) {
      setSkjemaError(undefined);
    }
  }, [form.watch()]);

  return (
    <FormProvider {...form}>
      <Form
        forrigeStegOnClick={() => gåTilSteg('SPØRSMÅL')}
        nesteStegKnappTekst={'Neste'}
        onSubmit={form.handleSubmit(async (data) => {
          setSkjemaError(undefined);

          if (manglerTimerPåArbeid(data.dager, !!utfylling.tilstand.svar.harDuJobbet)) {
            setSkjemaError('Du har svart at du har arbeidet i perioden, og må dermed føre timer.');
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
        <VStack gap={'6'}>
          <div>
            <Heading level={'2'} size={'large'} spacing>
              {innsendingtype === InnsendingType.INNSENDING ? 'Fyll ut meldekort' : 'Endre meldekort'}
            </Heading>
            <BodyShort>{`Uke ${hentUkeNummerForPeriode(fraDato, tilDato)} (${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)})`}</BodyShort>
          </div>
          <BodyLong>
            Skriv inn timene du har arbeidet for perioden. Timer skrives med desimal til nærmeste halvtime. For eksempel
            blir 7 timer og 30 min = 7,5 timer.
          </BodyLong>
          <ReadMore header={'Les mer om hva som skal fylles ut'}>Her kommer det informasjon</ReadMore>

          <Rapporteringskalender />

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
