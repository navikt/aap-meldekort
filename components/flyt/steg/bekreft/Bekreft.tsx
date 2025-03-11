'use client';

import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { Form } from 'components/form/Form';
import { Alert, BodyShort, ConfirmationPanel, Heading, HStack, VStack } from '@navikt/ds-react';
import { formaterDatoMedÅrForFrontend, formaterDatoUtenÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { SkjemaOppsummering } from 'components/skjemaoppsummering/SkjemaOppsummering';
import { UtfyllingResponse } from 'lib/types/types';
import { useState } from 'react';
import { InnsendingType, useParamsMedType } from 'lib/utils/url';
import { useTranslations } from 'next-intl';
import { Link } from 'i18n/routing';

interface Props {
  utfylling: UtfyllingResponse;
}

export const Bekreft = ({ utfylling }: Props) => {
  const t = useTranslations();
  const { referanse, innsendingtype } = useParamsMedType();
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);
  const [stemmerOpplysningene, setStemmerOpplysningene] = useState(false);
  const [formError, setFormError] = useState<string>();

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  return (
    <Form
      nesteStegKnappTekst={
        innsendingtype === InnsendingType.INNSENDING
          ? t('client.steg.bekreft.innsending.nesteStegKnappTekst')
          : t('client.steg.bekreft.korrigering.nesteStegKnappTekst')
      }
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
      visNesteKnapp={utfylling.metadata.kanSendesInn}
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
                periode: `${formaterDatoMedÅrForFrontend(fraDato)} - ${formaterDatoMedÅrForFrontend(tilDato)}`,
              })}
            </BodyShort>
          </HStack>
        </VStack>

        <SkjemaOppsummering utfylling={utfylling} visLenkeTilbakeTilSteg={true} />

        {utfylling.metadata.kanSendesInn && (
          <ConfirmationPanel
            checked={stemmerOpplysningene}
            label={t('client.steg.bekreft.skjema.label')}
            onChange={() => setStemmerOpplysningene((value) => !value)}
            error={!stemmerOpplysningene && formError}
          />
        )}

        {!utfylling.metadata.kanSendesInn && (
          <Alert variant={'info'}>
            <BodyShort>
              {t('client.steg.bekreft.kanIkkeSendesInn', {
                dato: formaterDatoUtenÅrForFrontend(utfylling.metadata.tidligsteInnsendingstidspunkt!),
              })}
            </BodyShort>

            {t.rich('client.steg.bekreft.link', {
              a: (chunks) => <Link href={'/'}>{chunks}</Link>,
            })}
          </Alert>
        )}
      </VStack>
    </Form>
  );
};
