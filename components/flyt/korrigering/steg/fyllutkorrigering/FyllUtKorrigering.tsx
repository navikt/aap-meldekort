'use client';

import { Alert, BodyShort, Heading, ReadMore, VStack } from '@navikt/ds-react';
import { useConfigForm } from '@navikt/aap-felles-react';
import { FormProvider } from 'react-hook-form';
import { Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';
import { useRouter, useSearchParams } from 'next/navigation';
import { useKorrigerMeldekort } from 'hooks/korrigerMeldekortHook';
import { useState } from 'react';
import {
  erGyldigTimer,
  replaceCommasWithDots,
  UtfyllingAvTimerError,
} from 'components/flyt/innsending/steg/timerarbeidet/Utfylling';
import { Form } from 'components/form/Form';

export interface FormFields {
  dager: Dag[];
}

interface Dag {
  dag: string;
  timer: string | null;
}

export const FyllUtKorrigering = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<UtfyllingAvTimerError[]>([]);
  const { korrigering, setKorrigering } = useKorrigerMeldekort();

  const { form } = useConfigForm<FormFields>({
    dager: {
      type: 'fieldArray',
      defaultValue: korrigering?.meldekort.timerArbeidet?.map((timerArbeidet) => ({
        dag: timerArbeidet.dato,
        timer: timerArbeidet.timer == null || timerArbeidet.timer === 0 ? '' : timerArbeidet.timer.toString(),
      })),
    },
  });

  return (
    <VStack gap={'4'}>
      <FormProvider {...form}>
        <Form
          onSubmit={form.handleSubmit((data) => {
            setErrors([]);
            const errors: UtfyllingAvTimerError[] = [];
            data.dager.map((dag, index) => {
              if (!erGyldigTimer(dag.timer)) {
                errors.push({ index: index, harError: true });
              }
            });
            setErrors(errors);

            if (errors.length === 0) {
              setKorrigering({
                ...korrigering,
                steg: 'SE_OVER_TIMER',
                endrerMeldekort: true,
                meldekort: {
                  ...korrigering.meldekort,
                  timerArbeidet: data.dager.map((dag) => ({
                    dato: dag.dag,
                    ...(dag.timer !== '' && dag.timer !== null && { timer: Number(replaceCommasWithDots(dag.timer)) }),
                  })),
                },
              });
            }
          })}
          forrigeStegKnappTekst={'Avbryt'}
          forrigeStegOnClick={() => router.push(`/innsendt/periode?${searchParams}`)}
          isLoading={false}
        >
          <VStack gap={'4'}>
            <Heading size={'medium'} level={'2'}>
              Endre meldekort
            </Heading>
            <BodyShort>
              Du kan endre tidligere innsendte meldekort X antall uker tilbake i tid. Husk at endret meldekort kan
              påvirke utbetalingen du fikk.
            </BodyShort>
            <ReadMore header={'Les mer om hvordan endre et meldekort'}>Her kommer det noe tekst</ReadMore>
            <Rapporteringskalender errors={errors} />
            {errors.length > 0 && (
              <Alert variant={'error'}>
                Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer.
              </Alert>
            )}
          </VStack>
        </Form>
      </FormProvider>
    </VStack>
  );
};
