'use client';

import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { JaEllerNei } from 'lib/utils/form';
import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { useKorrigerMeldekort } from 'hooks/korrigerMeldekortHook';
import { korrigerMeldekortClient } from 'lib/client/clientApi';
import { IngenEndringer } from 'components/flyt/korrigering/steg/seover/ingenendringer/IngenEndringer';
import { Form } from 'components/form/Form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';
import { regnUtTimer } from 'lib/utils/meldekort';

interface FormFields {
  opplysningerStemmer: JaEllerNei[];
}

export const SeOver = () => {
  const router = useRouter();
  const { korrigering, setKorrigering, harDetSkjeddEndringer } = useKorrigerMeldekort();
  const [isLoading, setIsLoading] = useState(false);

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
    <Form
      onSubmit={form.handleSubmit(async () => {
        setIsLoading(true);
        await korrigerMeldekortClient(korrigering.meldekort.meldekortId, {
          // @ts-ignore TODO Fiks type i context
          timerArbeidet: korrigering.meldekort.timerArbeidet?.map((data) => {
            return { dato: data.dato, timer: data.timer };
          }),
        });

        setIsLoading(false);
        setKorrigering({ ...korrigering, steg: 'KVITTERING' });
      })}
      forrigeStegOnClick={() => setKorrigering({ ...korrigering, steg: 'FYLL_TIMER' })}
      forrigeStegKnappTekst={'Endre'}
      nesteStegKnappTekst={'Send inn'}
      avbrytOnClick={() => router.push(`/innsendt`)}
      isLoading={isLoading}
    >
      <VStack gap={'4'}>
        <Heading size={'large'} level={'2'} spacing>
          Se over før du sender inn
        </Heading>

        <Alert variant={'warning'}>Meldekortet er ikke sendt inn ennå</Alert>
        <BodyShort spacing>Se over meldekortet ditt og pass på at alt er riktig før du sender inn.</BodyShort>
        <OppsummeringKalender
          dager={korrigering.meldekort.dager}
          periode={korrigering.meldekort.meldeperiode}
        >
          <OppsummeringTimer timer={regnUtTimer(korrigering.meldekort.dager)} />
        </OppsummeringKalender>
        <FormField form={form} formField={formFields.opplysningerStemmer} size={'medium'} />
      </VStack>
    </Form>
  );
};
