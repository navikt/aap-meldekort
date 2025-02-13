'use client';

import { BodyShort, Heading, ReadMore, VStack } from '@navikt/ds-react';
import { useConfigForm } from '@navikt/aap-felles-react';
import { FormProvider } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useKorrigerMeldekort } from 'hooks/korrigerMeldekortHook';
import { replaceCommasWithDots } from 'components/flyt/innsending/steg/utfylling/Utfylling';
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
  const { korrigering, setKorrigering } = useKorrigerMeldekort();

  const { form } = useConfigForm<FormFields>({
    dager: {
      type: 'fieldArray',
      defaultValue: korrigering?.meldekort.dager?.map((dag) => ({
        dag: dag.dato,
        timer: dag.timerArbeidet == null || dag.timerArbeidet === 0 ? '' : dag.timerArbeidet.toString(),
      })),
    },
  });

  return (
    <VStack gap={'4'}>
      <FormProvider {...form}>
        <Form
          onSubmit={form.handleSubmit((data) => {
            setKorrigering({
              ...korrigering,
              steg: 'SE_OVER_TIMER',
              endrerMeldekort: true,
              meldekort: {
                ...korrigering.meldekort,
                dager: data.dager.map((dag) => ({
                  dato: dag.dag,
                  ...(dag.timer !== '' && dag.timer !== null && { timer: Number(replaceCommasWithDots(dag.timer)) }),
                })),
              },
            });
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
            {/*<Rapporteringskalender meldekort={korrigering.meldekort.} />*/}
          </VStack>
        </Form>
      </FormProvider>
    </VStack>
  );
};
