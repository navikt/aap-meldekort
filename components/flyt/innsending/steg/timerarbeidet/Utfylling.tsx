'use client';

import { Form } from 'components/form/Form';
import { Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';
import { Alert, BodyLong, Heading, ReadMore, VStack } from '@navikt/ds-react';
import { useConfigForm } from '@navikt/aap-felles-react';
import { FormProvider } from 'react-hook-form';
import { useState } from 'react';
import { MeldekortResponse } from 'lib/types/types';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';

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

export interface UtfyllingAvTimerError {
  index: number;
  harError: boolean;
}

export const Utfylling = ({ meldekort, referanse }: Props) => {
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
  const [errors, setErrors] = useState<UtfyllingAvTimerError[]>([]);

  const { form } = useConfigForm<MeldepliktFormFields>({
    dager: {
      type: 'fieldArray',
      defaultValue: meldekort.meldekort.timerArbeidet.map((timerArbeidet) => ({
        dag: timerArbeidet.dato,
        timer: timerArbeidet.timer == null || timerArbeidet.timer === 0 ? '' : timerArbeidet.timer.toString(),
      })),
    },
  });

  return (
    <FormProvider {...form}>
      <Form
        referanse={referanse}
        forrigeSteg={'JOBBET_I_MELDEPERIODEN'}
        nesteStegKnappTekst={'Neste'}
        onSubmit={form.handleSubmit(async (data) => {
          setErrors([]);
          const errors: UtfyllingAvTimerError[] = [];
          data.dager.map((dag, index) => {
            if (!erGyldigTimer(dag.timer)) {
              errors.push({ index: index, harError: true });
            }
          });
          setErrors(errors);

          if (errors.length === 0) {
            løsStegOgGåTilNeste({
              meldekort: {
                ...meldekort.meldekort,
                timerArbeidet: data.dager.map((dag) => ({
                  dato: dag.dag,
                  timer: dag.timer !== null ? Number(dag.timer) : null,
                })),
              },
              nåværendeSteg: 'TIMER_ARBEIDET',
            });
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
          <Rapporteringskalender periode={meldekort.periode} errors={errors} />
          {errors.length > 0 && (
            <Alert variant={'error'}>
              Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer
            </Alert>
          )}
        </VStack>
      </Form>
    </FormProvider>
  );
};

export function erGyldigTimer(value: string | null): boolean {
  if (!value || value === '') {
    return true;
  }

  const valueAsNumber = Number(replaceCommasWithDots(value));

  if (isNaN(valueAsNumber) || valueAsNumber < 0 || valueAsNumber > 24) {
    return false;
  } else return (valueAsNumber * 10) % 5 === 0;
}

function replaceCommasWithDots(input: string): string {
  return input.replace(/,/g, '.');
}
