'use client';

import { Alert, BodyShort, Button, Heading, HStack, Link, List, VStack } from '@navikt/ds-react';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { UtfyllingResponse } from 'lib/types/types';
import { ArrowRightIcon } from '@navikt/aksel-icons';

interface Props {
  utfylling: UtfyllingResponse;
  referanse: string;
}

export const Introduksjon = ({ utfylling, referanse }: Props) => {
  const { løsStegOgGåTilNeste, isLoading, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  return (
    <section>
      <VStack gap={'8'}>
        <VStack gap={'4'}>
          <VStack gap={'2'}>
            <Heading
              level={'2'}
              size={'large'}
            >{`Meldekort for uke ${hentUkeNummerForPeriode(fraDato, tilDato)}`}</Heading>
            <BodyShort
              size={'large'}
            >{`${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)}`}</BodyShort>
          </VStack>
          <List size={'medium'}>
            <List.Item>
              Du kan sende dette meldekortet fra dd.mm, og senest dd.mm for å unngå trekk i utbetalingen.
            </List.Item>
            <List.Item>Du vil får utbetalt AAP cirka 2 til 3 virkedager etter at du har levert meldekortet.</List.Item>
          </List>
        </VStack>

        <VStack gap={'2'}>
          <BodyShort weight={'semibold'}>Takk for at du er ærlig</BodyShort>
          <BodyShort>Det er viktig at du gir oss riktige opplysninger.</BodyShort>
          <Link href={'https://www.nav.no/endringer'} target={'_blank'}>
            Les mer om viktigheten av å gi riktige opplysninger
          </Link>
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
