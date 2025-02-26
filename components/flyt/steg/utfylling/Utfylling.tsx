'use client';

import { Form } from 'components/form/Form';
import { Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';
import { Alert, BodyLong, ErrorSummary, Heading, List, ReadMore, VStack } from '@navikt/ds-react';
import { useConfigForm } from '@navikt/aap-felles-react';
import { FormProvider } from 'react-hook-form';
import { useState } from 'react';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { useRouter } from 'i18n/routing';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { UtfyllingResponse } from 'lib/types/types';

interface Props {
  utfylling: UtfyllingResponse;
  referanse: string;
}

export interface MeldepliktFormFields {
  dager: Dag[];
}

interface Dag {
  dag: string;
  timer: string | null;
}

export const Utfylling = ({ utfylling, referanse }: Props) => {
  const router = useRouter();
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
  const [errors, setErrors] = useState<string[]>([]);

  const { form } = useConfigForm<MeldepliktFormFields>({
    dager: {
      type: 'fieldArray',
      defaultValue: utfylling.tilstand.svar.dager.map((dag) => ({
        dag: dag.dato,
        timer: dag.timerArbeidet == null || dag.timerArbeidet === 0 ? '' : dag.timerArbeidet.toString(),
      })),
    },
  });

  const meldeperiodeUtfyllingErrors =
    form.formState.errors?.dager && Array.isArray(form.formState.errors.dager)
      ? form.formState.errors.dager
          .filter((dag) => dag?.timer)
          .map((dag) => ({
            ref: dag.timer.ref.name,
            message: dag.timer.message,
          }))
      : [];

  return (
    <FormProvider {...form}>
      <Form
        forrigeStegOnClick={() => router.push(`/${referanse}/SPØRSMÅL`)}
        nesteStegKnappTekst={'Neste'}
        onSubmit={form.handleSubmit(async (data) => {
          setErrors([]);
          const skjemaErrors: string[] = [];

          if (manglerTimerPåArbeid(data, !!utfylling.tilstand.svar.harDuJobbet)) {
            skjemaErrors.push('Du må føre timer');
          }

          setErrors(skjemaErrors);

          if (skjemaErrors.length === 0) {
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
          } else {
            window.scrollTo(0, 0);
          }
        })}
        isLoading={isLoading}
        errorMessage={errorMessage}
      >
        <VStack gap={'4'}>
          <Heading size={'large'} level={'2'}>
            Fyll ut meldekortet
          </Heading>
          <BodyLong>
            Fyll inn timene du har arbeidet i perioden. Timer skrives med desimal til nærmeste halvtime. 7 timer og 30
            min = 7,5 timer. 30 min = 0,50 timer
          </BodyLong>
          <ReadMore header={'Les mer om hva som skal fylles ut'}>Her kommer det informasjon</ReadMore>

          {meldeperiodeUtfyllingErrors.length > 0 && (
            <ErrorSummary>
              {meldeperiodeUtfyllingErrors.map((error) => (
                <ErrorSummary.Item key={error.ref} href={`#${encodeURIComponent(error.ref)}`}>
                  {error.message}
                </ErrorSummary.Item>
              ))}
            </ErrorSummary>
          )}

          {errors.length > 0 && (
            <Alert variant={'error'}>
              <List>
                {errors.map((error, index) => {
                  return <List.Item key={index}>{error}</List.Item>;
                })}
              </List>
            </Alert>
          )}
          <Rapporteringskalender />
        </VStack>
      </Form>
    </FormProvider>
  );
};

export function manglerTimerPåArbeid(value: MeldepliktFormFields, harSvartJaPåArbeid: boolean): boolean {
  if (!harSvartJaPåArbeid) {
    return false;
  }

  return value.dager.filter((dag) => dag.timer).length === 0;
}

export function replaceCommasWithDots(input: string): string {
  return input.replace(/,/g, '.');
}
