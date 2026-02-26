import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import { FraværDag } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { formaterDatoMedMånedIBokstaverOgÅr, fullDag } from 'lib/utils/date';
import { storForbokstav } from 'lib/utils/string';

import styles from './RegistrertFravær.module.css';
import { Fravær } from 'lib/types/types';

interface Props {
  fraværDag: FraværDag;
  slettFravær: () => void;
}

export const RegistrertFravær = ({ fraværDag, slettFravær }: Props) => {
  return (
    <HStack justify={'space-between'} align={'center'} className={styles.fravær}>
      <VStack gap={'space-8'}>
        <BodyShort
          weight={'semibold'}
        >{`${storForbokstav(fullDag(fraværDag.dato))} ${formaterDatoMedMånedIBokstaverOgÅr(fraværDag.dato)}`}</BodyShort>
        <BodyShort>{mapFraværEnumTilString(fraværDag.fravær)}</BodyShort>
      </VStack>

      <Button onClick={slettFravær} type={'button'} variant={'tertiary'}>
        Fjern
      </Button>
    </HStack>
  );
};

function mapFraværEnumTilString(value: NonNullable<Fravær>): string {
  switch (value) {
    case 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS':
      return 'Omsorg eller dødsfall i familie eller vennekrets';
    case 'SYKDOM_ELLER_SKADE':
      return 'Sykdom eller skade';
    case 'OMSORG_ANNEN_STERK_GRUNN':
      return 'Omsorg annen sterk grunn';
    case 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN':
      return 'Omsorg første skoledag, tilvenning eller annen oppfølging';
    case 'OMSORG_MEDDOMMER_ELLER_ANDRE_OFFENTLIGE_PLIKTER':
      return 'Omsorg meddommer eller andre offentlige plikter';
    case 'OMSORG_PLEIE_I_HJEMMET_AV_NÆR_PÅRØRENDE':
      return 'Omsorg pleie i hjemmet av nær pårørende';
    case 'ANNEN':
      return 'Annen';
  }
}
