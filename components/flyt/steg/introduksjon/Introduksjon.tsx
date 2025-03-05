'use client';

import { Alert, BodyShort, Button, Heading, HStack, Link, List, VStack } from '@navikt/ds-react';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { UtfyllingResponse } from 'lib/types/types';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { useTranslations } from 'next-intl';

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
    <section>
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
            {t('client.steg.introduksjon.informasjonomriktigopplysninger.heading')}
          </BodyShort>
          <BodyShort>{t('client.steg.introduksjon.informasjonomriktigopplysninger.riktigopplysninger')}</BodyShort>
          {t.rich('client.steg.introduksjon.informasjonomriktigopplysninger.link', {
            a: (chunks) => (
              <Link href={'https://www.nav.no/endringer'} target="_blank">
                {chunks}
              </Link>
            ),
          })}
        </VStack>

        {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}

        <HStack justify={'center'}>
          <Button
            icon={<ArrowRightIcon />}
            iconPosition={'right'}
            onClick={() =>
              løsStegOgGåTilNeste({
                nyTilstand: {
                  aktivtSteg: 'INTRODUKSJON',
                  svar: {
                    ...utfylling.tilstand.svar,
                    vilSvareRiktig: true,
                  },
                },
              })
            }
            loading={isLoading}
          >
            Neste
          </Button>
        </HStack>
      </VStack>
    </section>
  );
};
