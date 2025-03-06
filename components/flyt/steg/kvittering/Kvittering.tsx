'use client';

import { Accordion, Alert, List, VStack } from '@navikt/ds-react';
import { KommendeMeldekort, UtfyllingResponse } from 'lib/types/types';
import { Link } from 'i18n/routing';

import styles from 'components/flyt/steg/kvittering/Kvittering.module.css';
import { SkjemaOppsummering } from 'components/skjemaoppsummering/SkjemaOppsummering';
import { InnsendingType, useParamsMedType } from 'lib/utils/url';
import { useTranslations } from 'next-intl';

interface Props {
  utfylling: UtfyllingResponse;
  kommendeMeldekort?: KommendeMeldekort;
}

export const Kvittering = ({ utfylling, kommendeMeldekort }: Props) => {
  const t = useTranslations();
  const { innsendingtype } = useParamsMedType();

  console.log(kommendeMeldekort);
  return (
    <VStack gap={'8'}>
      <Alert variant="success">
        {innsendingtype === InnsendingType.INNSENDING
          ? t('client.steg.kvittering.alert.innsending.label')
          : t('client.steg.kvittering.alert.korrigering.label')}
      </Alert>

      <List>
        <List.Item>{t('client.steg.kvittering.bulletList.items.1')}</List.Item>
        <List.Item>{t('client.steg.kvittering.bulletList.items.2')}</List.Item>
      </List>

      <Accordion>
        <Accordion.Item>
          <Accordion.Header>{t('client.steg.kvittering.seHvaDuSendteInn')}</Accordion.Header>
          <Accordion.Content>
            <SkjemaOppsummering utfylling={utfylling} />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>

      {/*{InnsendingType.INNSENDING &&*/}
      {/*  kommendeMeldekort?.nesteMeldeperiode &&*/}
      {/*  t.rich('client.steg.kvittering.linkTilNesteMeldekort', {*/}
      {/*    a: (chunks) => {*/}
      {/*      return (*/}
      {/*        <Link href={`/innsending`} className={styles.link}>*/}
      {/*          {chunks}*/}
      {/*        </Link>*/}
      {/*      );*/}
      {/*    },*/}
      {/*    meldeperiode: `${hentUkeNummerForPeriode(new Date(kommendeMeldekort.nesteMeldeperiode.meldeperiode.fom), new Date(kommendeMeldekort.nesteMeldeperiode.meldeperiode.tom))}`,*/}
      {/*  })}*/}

      {t.rich('client.steg.kvittering.linkTilOversikt', {
        a: (chunks) => {
          return (
            <Link href={`/`} className={styles.link}>
              {chunks}
            </Link>
          );
        },
      })}
    </VStack>
  );
};
