'use client';

import { HistoriskMeldekortDetaljer } from 'lib/types/types';
import { BodyShort, Button, Heading, ReadMore, VStack } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { JaEllerNei } from 'lib/utils/form';

import styles from './EndreMeldekort.module.css';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { FormProvider } from 'react-hook-form';
import { Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';
import { useParams, useRouter } from 'next/navigation';

interface Props {
  meldekort: HistoriskMeldekortDetaljer;
}

export interface FormFields {
  dager: Dag[];
  endreMeldekort: JaEllerNei[];
}

interface Dag {
  dag: string;
  timer: string | null;
}

export const EndreMeldekort = ({ meldekort }: Props) => {
  const router = useRouter();
  const params = useParams<{ system: string }>();

  const { form, formFields } = useConfigForm<FormFields>({
    dager: {
      type: 'fieldArray',
      defaultValue: meldekort?.timerArbeidet?.map((timerArbeidet) => ({
        dag: timerArbeidet.dato,
        timer: timerArbeidet.timer?.toString() || '',
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
        <form onSubmit={form.handleSubmit((data) => {})}>
          <VStack gap={'4'}>
            <BodyShort>
              Du kan endre tidligere innsendte meldekort X antall uker tilbake i tid. Husk at endret meldekort kan
              påvirke utbetalingen du fikk.
            </BodyShort>
            <ReadMore header={'Les mer om hvordan endre et meldekort'}>Her kommer det noe tekst</ReadMore>
            <FormField form={form} formField={formFields.endreMeldekort} size={'medium'} />
            {endrer ? (
              <Rapporteringskalender periode={meldekort.meldeperiode} errors={[]} />
            ) : (
              <OppsummeringKalender timerArbeidet={meldekort.timerArbeidet} periode={meldekort.meldeperiode} />
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
