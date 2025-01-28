'use client';

import { Alert, BodyShort, Button, Heading, ReadMore, VStack } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { JaEllerNei } from 'lib/utils/form';

import styles from 'components/flyt/korrigering/steg/fyllutkorrigering/FyllUtKorrigering.module.css';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { FormProvider } from 'react-hook-form';
import { Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';
import { useParams, useRouter } from 'next/navigation';
import { useKorrigerMeldekort } from 'hooks/korrigerMeldekortHook';
import { useState } from 'react';
import { erGyldigTimer, UtfyllingAvTimerError } from 'components/flyt/innsending/steg/timerarbeidet/Utfylling';
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';

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
  const [errors, setErrors] = useState<UtfyllingAvTimerError[]>([]);

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
      label: 'Endre meldekort',
      hideLabel: true,
      defaultValue: korrigering.endrerMeldekort ? [JaEllerNei.Ja] : [],
      options: [{ label: 'Endre meldekort', value: JaEllerNei.Ja }],
    },
  });

  const endrer = form.watch('endreMeldekort')?.includes(JaEllerNei.Ja);
  const visNesteKnapp = endrer && korrigering.meldekort.kanEndres && korrigering.meldekort.timerArbeidet !== null;

  return (
    <VStack gap={'4'}>
      <Heading size={'medium'} level={'2'}>
        Se og endre meldekort
      </Heading>
      <FormProvider {...form}>
        <form
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
                    ...(dag.timer !== '' && { timer: Number(dag.timer) }),
                  })),
                },
              });
            }
          })}
        >
          <VStack gap={'4'}>
            <BodyShort>
              Du kan endre tidligere innsendte meldekort X antall uker tilbake i tid. Husk at endret meldekort kan
              påvirke utbetalingen du fikk.
            </BodyShort>
            <ReadMore header={'Les mer om hvordan endre et meldekort'}>Her kommer det noe tekst</ReadMore>
            {korrigering.meldekort.kanEndres && (
              <FormField form={form} formField={formFields.endreMeldekort} size={'medium'} />
            )}
            {endrer ? (
              <Rapporteringskalender periode={korrigering.meldekort.meldeperiode} errors={errors} />
            ) : (
              <OppsummeringKalender
                timerArbeidet={korrigering.meldekort.timerArbeidet}
                periode={korrigering.meldekort.meldeperiode}
                utbetalt={korrigering.meldekort.bruttoBeløp}
                innsendtDato={korrigering.meldekort.innsendtDato}
              />
            )}
            {errors.length > 0 && (
              <Alert variant={'error'}>
                Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer.
              </Alert>
            )}
            <div className={styles.buttons}>
              <Button
                variant={'secondary'}
                onClick={() => router.push(`/${params.system}/innsendt`)}
                type={'button'}
                iconPosition={'left'}
                icon={<ArrowLeftIcon />}
              >
                Tilbake
              </Button>
              {visNesteKnapp && (
                <Button iconPosition={'right'} icon={<ArrowRightIcon />}>
                  Neste
                </Button>
              )}
            </div>
          </VStack>
        </form>
      </FormProvider>
    </VStack>
  );
};
