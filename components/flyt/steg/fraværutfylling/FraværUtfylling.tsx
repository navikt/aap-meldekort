import { BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import { UtfyllingResponse } from 'lib/types/types';
import { formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { useTranslations } from 'next-intl';

interface Props {
  utfylling: UtfyllingResponse;
}

export const FraværUtfylling = ({ utfylling }: Props) => {
  const t = useTranslations();
  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  return (
    <VStack gap={'space-32'}>
      <VStack gap={'space-8'}>
        <Heading level={'2'} size={'large'}>
          {t('client.steg.fraværutfylling.heading')}
        </Heading>
        <BodyShort>
          {t('client.steg.fraværutfylling.periode', {
            uker: hentUkeNummerForPeriode(fraDato, tilDato),
            periode: `${formaterDatoMedÅrForFrontend(fraDato)} - ${formaterDatoMedÅrForFrontend(tilDato)}`,
          })}
        </BodyShort>
        <BodyShort>{t('client.steg.fraværutfylling.description')}</BodyShort>
      </VStack>
      <Button type={'button'}>{t('client.steg.fraværutfylling.leggTilDag')}</Button>
    </VStack>
  );
};
