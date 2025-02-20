'use client';

import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { JaEllerNei } from 'lib/utils/form';
import { Form } from 'components/form/Form';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { useRouter } from 'i18n/routing';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { SkjemaOppsummering } from 'components/skjemaoppsummering/SkjemaOppsummering';
import { UtfyllingResponse } from 'lib/types/types';

interface Props {
  referanse: string;
  utfylling: UtfyllingResponse;
}

interface FormFields {
  opplysningerStemmer: JaEllerNei[];
}

export const Bekreft = ({ referanse, utfylling }: Props) => {
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

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  return (
    <Form
      forrigeStegOnClick={() =>
        router.push(`/${referanse}/${utfylling.tilstand.svar.harDuJobbet ? 'UTFYLLING' : 'SPØRSMÅL'}`)
      }
      nesteStegKnappTekst={'Send inn'}
      onSubmit={form.handleSubmit(async () => {
        løsStegOgGåTilNeste({
          nyTilstand: {
            aktivtSteg: 'BEKREFT',
            svar: {
              ...utfylling.tilstand.svar,
              stemmerOpplysningene: true,
            },
          },
        });
      })}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <VStack gap={'6'}>
        <MeldekortLenke
          label={'Tilbake'}
          href={`/${referanse}/${utfylling.tilstand.svar.harDuJobbet ? 'UTFYLLING' : 'SPØRSMÅL'}`}
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

        <SkjemaOppsummering utfylling={utfylling} visLenkeTilbakeTilSteg={true} />

        <FormField form={form} formField={formFields.opplysningerStemmer} size={'medium'} />
      </VStack>
    </Form>
  );
};
