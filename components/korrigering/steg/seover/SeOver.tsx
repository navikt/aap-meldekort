'use client';

import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { JaEllerNei } from 'lib/utils/form';
import { Alert, BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { useKorrigerMeldekort } from 'hooks/korrigerMeldekortHook';
import styles from 'components/korrigering/steg/fyllutkorrigering/FyllUtKorrigering.module.css';
import { korrigerMeldekortClient } from 'lib/client/clientApi';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { IngenEndringer } from 'components/korrigering/steg/seover/ingenendringer/IngenEndringer';

interface FormFields {
  opplysningerStemmer: JaEllerNei[];
}

export const SeOver = () => {
  const { korrigering, setKorrigering, harDetSkjeddEndringer } = useKorrigerMeldekort();

  const { form, formFields } = useConfigForm<FormFields>({
    opplysningerStemmer: {
      type: 'checkbox',
      label: 'Bekreft at opplysningene stemmer',
      hideLabel: true,
      options: [{ label: 'Jeg bekrefter at disse opplysningene stemmer', value: JaEllerNei.Ja }],
      rules: { required: 'Du må bekrefte at disse opplysningene stemmer' },
    },
  });

  if (!harDetSkjeddEndringer()) {
    return <IngenEndringer />;
  }

  return (
    <form
      onSubmit={form.handleSubmit(async () => {
        await korrigerMeldekortClient(korrigering.meldekort.meldekortId, {
          // @ts-ignore TODO Fiks type i context
          timerArbeidet: korrigering.meldekort.timerArbeidet?.map((data) => {
            return { dato: data.dato, timer: data.timer };
          }),
        }).then(() => setKorrigering({ ...korrigering, steg: 'KVITTERING' }));
      })}
    >
      <VStack gap={'4'}>
        <Heading size={'large'} level={'2'} spacing>
          Se over før du sender inn
        </Heading>

        <Alert variant={'warning'}>Meldekortet er ikke sendt inn ennå</Alert>
        <BodyShort spacing>Se over meldekortet ditt og pass på at alt er riktig før du sender inn.</BodyShort>
        <OppsummeringKalender
          timerArbeidet={korrigering.meldekort.timerArbeidet}
          periode={korrigering.meldekort.meldeperiode}
        />
        <FormField form={form} formField={formFields.opplysningerStemmer} size={'medium'} />
        <div className={styles.buttons}>
          <Button
            variant={'secondary'}
            onClick={() => setKorrigering({ ...korrigering, steg: 'FYLL_TIMER' })}
            type={'button'}
            iconPosition={'left'}
            icon={<ArrowLeftIcon />}
          >
            Endre
          </Button>
          <Button>Send inn</Button>
        </div>
      </VStack>
    </form>
  );
};
