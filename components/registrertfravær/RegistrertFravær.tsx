import { BodyShort, Button, HStack, Tag, VStack } from '@navikt/ds-react';
import { FraværDag } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { formaterDatoMedMånedIBokstaverOgÅr, fullDag } from 'lib/utils/date';
import { storForbokstav } from 'lib/utils/string';

import styles from './RegistrertFravær.module.css';
import { Fravær } from 'lib/types/types';
import { useTranslations } from 'use-intl';
import { fraværsgrunner } from 'components/flyt/steg/fraværutfylling/RegistrerFraværDialog';

interface Props {
  felt: FraværDag;
  slettFravær: () => void;
  timerArbeidet: number | null;
  visTrekkTag?: boolean;
}

export const RegistrertFravær = ({ felt, slettFravær, timerArbeidet, visTrekkTag = false }: Props) => {
  const t = useTranslations();
  return (
    <HStack justify={'space-between'} align={'center'} className={styles.fravær}>
      <VStack gap={'space-4'}>
        <BodyShort
          weight={'semibold'}
        >{`${storForbokstav(fullDag(felt.dato))} ${formaterDatoMedMånedIBokstaverOgÅr(felt.dato)}`}</BodyShort>
        <BodyShort>{t(mapFraværEnumTilString(felt.fravær))}</BodyShort>
        {timerArbeidet && (
          <div>
            <Tag variant={'outline'} data-color="info" size="small">
              {t('client.steg.fraværutfylling.timerArbeidet', { timerArbeidet })}
            </Tag>
          </div>
        )}
        {visTrekkTag && (
          <div>
            <Tag variant={'outline'} data-color="warning" size="small">
              {t('client.steg.fraværutfylling.trekk.tag')}
            </Tag>
          </div>
        )}
      </VStack>

      <Button onClick={slettFravær} type={'button'} variant={'tertiary'}>
        Fjern
      </Button>
    </HStack>
  );
};

function mapFraværEnumTilString(value: NonNullable<Fravær>): string {
  return fraværsgrunner.find((fraværsgrunn) => fraværsgrunn.value === value)?.labelKey || value;
}
