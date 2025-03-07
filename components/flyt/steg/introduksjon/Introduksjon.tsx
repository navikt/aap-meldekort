'use client';

import { Alert, BodyShort, Heading, Link, List, VStack } from '@navikt/ds-react';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { UtfyllingResponse } from 'lib/types/types';
import { useTranslations } from 'next-intl';
import { Form } from 'components/form/Form';

interface Props {
  utfylling: UtfyllingResponse;
  referanse: string;
}

export const Introduksjon = ({ utfylling, referanse }: Props) => {
  const t = useTranslations();
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();

        løsStegOgGåTilNeste({
          nyTilstand: {
            aktivtSteg: 'INTRODUKSJON',
            svar: {
              ...utfylling.tilstand.svar,
              vilSvareRiktig: true,
            },
          },
        });
      }}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <VStack gap={'8'}>
        <VStack gap={'4'}>
          <VStack gap={'2'}>
            <Heading level={'2'} size={'large'}>
              {t('client.steg.introduksjon.heading', {
                uker: hentUkeNummerForPeriode(fraDato, tilDato),
              })}
            </Heading>

            <BodyShort
              size={'large'}
            >{`${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)}`}</BodyShort>
          </VStack>
          <List size={'medium'}>
            <List.Item>
              {t('client.steg.introduksjon.bulletList.item.1', {
                tidligsteDato: 'TODO',
                senesteDato: 'TODO',
              })}
            </List.Item>
            <List.Item>{t('client.steg.introduksjon.bulletList.item.2')}</List.Item>
          </List>
        </VStack>

        <VStack gap={'2'}>
          <BodyShort weight={'semibold'}>
            {t('client.steg.introduksjon.informasjonOmRiktigeOpplysninger.riktigOpplysninger')}
          </BodyShort>
          {t.rich('client.steg.introduksjon.informasjonOmRiktigeOpplysninger.link', {
            a: (chunks) => (
              <Link href={'https://www.nav.no/endringer'} target="_blank">
                {chunks}
              </Link>
            ),
          })}
        </VStack>

        {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}
      </VStack>
    </Form>
  );
};
