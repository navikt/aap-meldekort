'use client';

import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { Form } from 'components/form/Form';
import { BodyShort, ConfirmationPanel, Heading, HStack, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { SkjemaOppsummering } from 'components/skjemaoppsummering/SkjemaOppsummering';
import { UtfyllingResponse } from 'lib/types/types';
import { useState } from 'react';
import { InnsendingType, useGåTilSteg, useParamsMedType } from 'lib/utils/url';
import { useTranslations } from 'next-intl';

interface Props {
  utfylling: UtfyllingResponse;
}

export const Bekreft = ({ utfylling }: Props) => {
  const t = useTranslations();
  const { referanse, innsendingtype } = useParamsMedType();
  const { gåTilSteg } = useGåTilSteg();
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
  const [stemmerOpplysningene, setStemmerOpplysningene] = useState(false);
  const [formError, setFormError] = useState<string>();

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  return (
    <Form
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
          setFormError(t('client.steg.bekreft.skjema.error'));
        }
      }}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <VStack gap={'8'}>
        <VStack gap={'2'}>
          <Heading size={'large'} level={'2'}>
            {innsendingtype === InnsendingType.INNSENDING
              ? t('client.steg.bekreft.innsending.heading')
              : t('client.steg.bekreft.korrigering.heading')}
          </Heading>
          <HStack gap={'2'}>
            <BodyShort>
              {t('client.steg.bekreft.periode', {
                uker: hentUkeNummerForPeriode(fraDato, tilDato),
                periode: `${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)}`,
              })}
            </BodyShort>
          </HStack>
        </VStack>

        <SkjemaOppsummering utfylling={utfylling} visLenkeTilbakeTilSteg={true} />

        <ConfirmationPanel
          checked={stemmerOpplysningene}
          label={t('client.steg.bekreft.skjema.label')}
          onChange={() => setStemmerOpplysningene((value) => !value)}
          error={!stemmerOpplysningene && formError}
        />
      </VStack>
    </Form>
  );
};
