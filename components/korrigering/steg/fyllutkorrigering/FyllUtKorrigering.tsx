'use client';

import { BodyShort, Button, Heading, ReadMore, VStack } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { JaEllerNei } from 'lib/utils/form';

import styles from 'components/korrigering/steg/fyllutkorrigering/FyllUtKorrigering.module.css';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { FormProvider } from 'react-hook-form';
import { Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';
import { useParams, useRouter } from 'next/navigation';
import { useKorrigerMeldekort } from 'hooks/korrigerMeldekortHook';
import timer from '@navikt/aksel-icons/src/Timer';

export interface FormFields {
  dager: Dag[];
  endreMeldekort: JaEllerNei[];
}

interface Dag {
  dag: string;
  timer: string | null;
}

export const FyllUtKorrigering = () => {
  const router = useRouter();
  const params = useParams<{ system: string }>();

  const { korrigering, setKorrigering } = useKorrigerMeldekort();

  const { form, formFields } = useConfigForm<FormFields>({
    dager: {
      type: 'fieldArray',
      defaultValue: korrigering?.meldekort.timerArbeidet?.map((timerArbeidet) => ({
        dag: timerArbeidet.dato,
        timer: timerArbeidet.timer == null || timerArbeidet.timer === 0 ? '' : timerArbeidet.timer.toString(),
      })),
    },
    endreMeldekort: {
      type: 'checkbox',
      label: 'Bekreft at opplysningene stemmer',
      hideLabel: true,
      options: [{ label: 'Endre meldekort', value: JaEllerNei.Ja }],
    },
  });

  const endrer = form.watch('endreMeldekort')?.includes(JaEllerNei.Ja);

  return (
    <VStack gap={'4'}>
      <Heading size={'medium'} level={'2'}>
        Se og endre meldekort
      </Heading>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            setKorrigering({
              ...korrigering,
              steg: 'SE_OVER_TIMER',
              meldekort: {
                ...korrigering.meldekort,
                timerArbeidet: data.dager.map((dag) => ({
                  dato: dag.dag,
                  timer: dag.timer !== null ? Number(dag.timer) : null,
                })),
              },
            });
          })}
        >
          <VStack gap={'4'}>
            <BodyShort>
              Du kan endre tidligere innsendte meldekort X antall uker tilbake i tid. Husk at endret meldekort kan
              påvirke utbetalingen du fikk.
            </BodyShort>
            <ReadMore header={'Les mer om hvordan endre et meldekort'}>Her kommer det noe tekst</ReadMore>
            <FormField form={form} formField={formFields.endreMeldekort} size={'medium'} />
            {endrer ? (
              <Rapporteringskalender periode={korrigering.meldekort.meldeperiode} errors={[]} />
            ) : (
              <OppsummeringKalender
                timerArbeidet={korrigering.meldekort.timerArbeidet}
                periode={korrigering.meldekort.meldeperiode}
              />
            )}
            <div className={styles.buttons}>
              <Button variant={'secondary'} onClick={() => router.push(`/${params.system}/innsendt`)} type={'button'}>
                Tilbake
              </Button>
              <Button disabled={!endrer}>Neste</Button>
            </div>
          </VStack>
        </form>
      </FormProvider>
    </VStack>
  );
};
