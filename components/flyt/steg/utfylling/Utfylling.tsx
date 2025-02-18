'use client';

import { Form } from 'components/form/Form';
import { Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';
import { Alert, BodyLong, Heading, List, ReadMore, VStack } from '@navikt/ds-react';
import { useConfigForm } from '@navikt/aap-felles-react';
import { FormProvider } from 'react-hook-form';
import { useState } from 'react';
import { MeldekortResponse } from 'lib/types/types';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { useRouter } from 'i18n/routing';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';

interface Props {
  meldekort: MeldekortResponse;
  referanse: string;
}

export interface MeldepliktFormFields {
  dager: Dag[];
}

interface Dag {
  dag: string;
  timer: string | null;
}

export const Utfylling = ({ meldekort, referanse }: Props) => {
  const router = useRouter();
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
  const [errors, setErrors] = useState<string[]>([]);

  const { form } = useConfigForm<MeldepliktFormFields>({
    dager: {
      type: 'fieldArray',
      defaultValue: meldekort.meldekort.dager.map((dag) => ({
        dag: dag.dato,
        timer: dag.timerArbeidet == null || dag.timerArbeidet === 0 ? '' : dag.timerArbeidet.toString(),
      })),
    },
  });

  return (
    <FormProvider {...form}>
      <Form
        forrigeStegOnClick={() => router.push(`/${referanse}/SPØRSMÅL`)}
        nesteStegKnappTekst={'Neste'}
        onSubmit={form.handleSubmit(async (data) => {
          setErrors([]);
          const skjemaErrors: string[] = [];

          if (manglerTimerPåArbeid(data, !!meldekort.meldekort.harDuJobbet)) {
            skjemaErrors.push('Du må føre timer');
          }

          setErrors(skjemaErrors);

          if (skjemaErrors.length === 0) {
            løsStegOgGåTilNeste({
              meldekort: {
                ...meldekort.meldekort,
                dager: data.dager.map((dag) => ({
                  dato: dag.dag,
                  timerArbeidet: dag.timer ? Number(replaceCommasWithDots(dag.timer)) : null,
                })),
              },
              nåværendeSteg: 'UTFYLLING',
            });
          } else {
            window.scrollTo(0, 0);
          }
        })}
        isLoading={isLoading}
        errorMessage={errorMessage}
      >
        <VStack gap={'4'}>
          <MeldekortLenke label={'Tilbake'} href={`/${referanse}/SPØRSMÅL`} />
          <Heading size={'large'} level={'2'}>
            Fyll ut meldekortet
          </Heading>
          <BodyLong>
            Fyll inn timene du har arbeidet i perioden. Timer skrives med desimal til nærmeste halvtime. 7 timer og 30
            min = 7,5 timer. 30 min = 0,50 timer
          </BodyLong>
          <ReadMore header={'Les mer om hva som skal fylles ut'}>Her kommer det informasjon</ReadMore>

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

export function erGyldigTimer(value: string | null): boolean {
  if (!value || value === '') {
    return true;
  }

  const valueAsNumber = Number(replaceCommasWithDots(value));

  if (isNaN(valueAsNumber) || valueAsNumber < 0 || valueAsNumber > 24) {
    return false;
  } else return (valueAsNumber * 10) % 5 === 0;
}

export function replaceCommasWithDots(input: string): string {
  return input.replace(/,/g, '.');
}
