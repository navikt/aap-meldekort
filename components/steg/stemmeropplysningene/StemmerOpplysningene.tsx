'use client';

import { MeldekortResponse } from 'lib/types/types';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { JaEllerNei } from 'lib/utils/form';
import { Form } from 'components/form/Form';
import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';

interface Props {
  referanse: string;
  meldekort: MeldekortResponse;
}

interface FormFields {
  opplysningerStemmer: JaEllerNei[];
}

export const StemmerOpplysningene = ({ referanse, meldekort }: Props) => {
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);

  const { form, formFields } = useConfigForm<FormFields>({
    opplysningerStemmer: {
      type: 'checkbox',
      label: 'Bekreft at opplysningene stemmer',
      hideLabel: true,
      options: [{ label: 'Jeg bekrefter at disse opplysningene stemmer', value: JaEllerNei.Ja }],
      rules: { required: 'Du må bekrefte at disse opplysningene stemmer' },
    },
  });

  return (
    <Form
      referanse={referanse}
      forrigeSteg={meldekort.meldekort.harDuJobbet ? 'TIMER_ARBEIDET' : 'JOBBET_I_MELDEPERIODEN'}
      nesteStegKnappTekst={'Send inn'}
      forrigeStegKnappTekst={'Endre'}
      onSubmit={form.handleSubmit(async () => {
        løsStegOgGåTilNeste({
          meldekort: {
            ...meldekort.meldekort,
            stemmerOpplysningene: true,
          },
          nåværendeSteg: 'STEMMER_OPPLYSNINGENE',
        });
      })}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <VStack gap={'4'}>
        <Heading size={'large'} level={'2'} spacing>
          Se over før du sender inn
        </Heading>

        <Alert variant={'warning'}>Meldekortet er ikke sendt inn ennå</Alert>
        <BodyShort spacing>Se over meldekortet ditt og pass på at alt er riktig før du sender inn.</BodyShort>

        {!meldekort.meldekort.harDuJobbet && (
          <VStack gap={'1'}>
            <BodyShort>Du har svart:</BodyShort>
            <BodyShort weight={'semibold'}>At du ikke har jobbet i denne perioden.</BodyShort>
            <BodyShort weight={'semibold'}>0 timer</BodyShort>
          </VStack>
        )}

        <OppsummeringKalender timerArbeidet={meldekort.meldekort.timerArbeidet} periode={meldekort.periode} />
        <FormField form={form} formField={formFields.opplysningerStemmer} size={'medium'} />
      </VStack>
    </Form>
  );
};
