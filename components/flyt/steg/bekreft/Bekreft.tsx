'use client';

import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { JaEllerNei } from 'lib/utils/form';
import { Form } from 'components/form/Form';
import { BodyShort, ConfirmationPanel, Heading, HStack, VStack } from '@navikt/ds-react';
import { useRouter } from 'i18n/routing';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { SkjemaOppsummering } from 'components/skjemaoppsummering/SkjemaOppsummering';
import { UtfyllingResponse } from 'lib/types/types';
import { useState } from 'react';

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
  const [stemmerOpplysningene, setStemmerOpplysningene] = useState(false);
  const [formError, setFormError] = useState<string>();

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  return (
    <Form
      forrigeStegOnClick={() =>
        router.push(`/${referanse}/${utfylling.tilstand.svar.harDuJobbet ? 'UTFYLLING' : 'SPØRSMÅL'}`)
      }
      nesteStegKnappTekst={'Send inn'}
      onSubmit={(formEvent) => {
        formEvent.preventDefault();
        setFormError(undefined);

        if (stemmerOpplysningene) {
          løsStegOgGåTilNeste({
            nyTilstand: {
              aktivtSteg: 'BEKREFT',
              svar: {
                ...utfylling.tilstand.svar,
                stemmerOpplysningene: true,
              },
            },
          });
        } else {
          setFormError('Du må bekrefte at disse opplysningene stemmer');
        }
      }}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <VStack gap={'4'}>
        <VStack gap={'2'}>
          <Heading size={'large'} level={'2'} spacing>
            Se over og send inn meldekort
          </Heading>

          <HStack gap={'2'}>
            <BodyShort>{`Uke ${hentUkeNummerForPeriode(fraDato, tilDato)}`}</BodyShort>
            <BodyShort>{`(${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)})`}</BodyShort>
          </HStack>
        </VStack>

        <SkjemaOppsummering utfylling={utfylling} visLenkeTilbakeTilSteg={true} />

        <ConfirmationPanel
          checked={stemmerOpplysningene}
          label="Jeg bekrefter at jeg har gitt riktige opplysninger"
          onChange={() => setStemmerOpplysningene((value) => !value)}
          error={!stemmerOpplysningene && formError}
        />
      </VStack>
    </Form>
  );
};
