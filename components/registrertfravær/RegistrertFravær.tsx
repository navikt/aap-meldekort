import { BodyShort, Button, HStack, Tag, VStack } from '@navikt/ds-react';
import { FraværDag } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { formaterDatoMedDagOgMåndedIBokstaver } from 'lib/utils/date';
import { storForbokstav } from 'lib/utils/string';

import styles from './RegistrertFravær.module.css';
import { Fravær } from 'lib/types/types';
import { useTranslations } from 'use-intl';

interface RadioOptionsType<Enum = string, LabelKey = string> {
  value: Enum;
  textKey: LabelKey;
  description?: boolean;
}

export const fraværsgrunner: RadioOptionsType<NonNullable<Fravær>>[] = [
  {
    value: 'SYKDOM_ELLER_SKADE',
    textKey: 'client.steg.fraværutfylling.dialog.grunn.grunner.sykdomSkade',
  },
  {
    value: 'OMSORG_ANNEN_STERK_GRUNN',
    textKey: 'client.steg.fraværutfylling.dialog.grunn.grunner.omsorgAnnenSterkGrunn',
  },
  {
    value: 'OMSORG_PLEIE_I_HJEMMET_AV_NÆR_PÅRØRENDE',
    textKey: 'client.steg.fraværutfylling.dialog.grunn.grunner.omsorgPleieIHjemmet',
  },
  {
    value: 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN',
    textKey: 'client.steg.fraværutfylling.dialog.grunn.grunner.oppfølgingAvBarn',
  },
  {
    value: 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS',
    textKey: 'client.steg.fraværutfylling.dialog.grunn.grunner.dødsfall',
  },
  { value: 'ANNEN', textKey: 'client.steg.fraværutfylling.dialog.grunn.grunner.annen' },
];

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
        <HStack gap={'space-8'}>
          <BodyShort weight={'semibold'}>{storForbokstav(formaterDatoMedDagOgMåndedIBokstaver(felt.dato))}</BodyShort>
          {visTrekkTag && (
            <div>
              <Tag variant={'outline'} data-color="warning" size="small">
                {t('client.steg.fraværutfylling.trekk.tag')}
              </Tag>
            </div>
          )}
        </HStack>
        <BodyShort>{t(`${mapFraværEnumTilString(felt.fravær)}.label`)}</BodyShort>
        {timerArbeidet && (
          <div>
            <Tag variant={'outline'} data-color="info" size="small">
              {t('client.steg.fraværutfylling.timerArbeidet', { timerArbeidet })}
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
  return fraværsgrunner.find((fraværsgrunn) => fraværsgrunn.value === value)?.textKey || value;
}
