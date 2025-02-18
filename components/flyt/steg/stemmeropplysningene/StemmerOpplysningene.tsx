'use client';

import { MeldekortResponse } from 'lib/types/types';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { JaEllerNei } from 'lib/utils/form';
import { Form } from 'components/form/Form';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { useRouter } from 'i18n/routing';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { SkjemaOppsummering } from 'components/skjemaoppsummering/SkjemaOppsummering';

interface Props {
  referanse: string;
  meldekort: MeldekortResponse;
}

interface FormFields {
  opplysningerStemmer: JaEllerNei[];
}

export const StemmerOpplysningene = ({ referanse, meldekort }: Props) => {
  const router = useRouter();
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

  const fraDato = new Date(meldekort.periode.fom);
  const tilDato = new Date(meldekort.periode.tom);

  return (
    <Form
      forrigeStegOnClick={() =>
        router.push(`/${referanse}/${meldekort.meldekort.harDuJobbet ? 'UTFYLLING' : 'SPØRSMÅL'}`)
      }
      nesteStegKnappTekst={'Send inn'}
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
      <VStack gap={'6'}>
        <MeldekortLenke
          label={'Tilbake'}
          href={`/${referanse}/${meldekort.meldekort.harDuJobbet ? 'UTFYLLING' : 'SPØRSMÅL'}`}
        />
        <Heading size={'large'} level={'2'} spacing>
          Se over og send inn meldekort
        </Heading>

        <BodyShort spacing>
          Se over opplysningene på meldekortet ditt og pass på at alt er riktig før du sender inn.
        </BodyShort>

        <VStack gap={'2'}>
          <BodyShort weight={'semibold'}>{`Uke ${hentUkeNummerForPeriode(fraDato, tilDato)}`}</BodyShort>
          <BodyShort>{`${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)}`}</BodyShort>
        </VStack>

        <SkjemaOppsummering meldekort={meldekort} visLenkeTilbakeTilSteg={true} />

        <FormField form={form} formField={formFields.opplysningerStemmer} size={'medium'} />
      </VStack>
    </Form>
  );
};
