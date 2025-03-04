'use client';

import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { Form } from 'components/form/Form';
import { BodyShort, ConfirmationPanel, Heading, HStack, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { SkjemaOppsummering } from 'components/skjemaoppsummering/SkjemaOppsummering';
import { UtfyllingResponse } from 'lib/types/types';
import { useState } from 'react';
import { InnsendingType, useGåTilSteg, useParamsMedType } from 'lib/utils/url';

interface Props {
  utfylling: UtfyllingResponse;
}

export const Bekreft = ({ utfylling }: Props) => {
  const { referanse, innsendingtype } = useParamsMedType();
  const { gåTilSteg } = useGåTilSteg();
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
  const [stemmerOpplysningene, setStemmerOpplysningene] = useState(false);
  const [formError, setFormError] = useState<string>();

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  return (
    <Form
      forrigeStegOnClick={() => gåTilSteg(utfylling.tilstand.svar.harDuJobbet ? 'UTFYLLING' : 'SPØRSMÅL')}
      nesteStegKnappTekst={innsendingtype === InnsendingType.INNSENDING ? 'Send inn' : 'Send inn endringene'}
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
      <VStack gap={'8'}>
        <VStack gap={'2'}>
          <Heading size={'large'} level={'2'}>
            {innsendingtype === InnsendingType.INNSENDING
              ? 'Se over og send inn meldekort'
              : 'Se over og send inn endringene'}
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
