'use client';

import { BodyShort, Link, ReadMore } from '@navikt/ds-react';
import { useTranslations } from 'next-intl';

export const Opplysningsinformasjon = () => {
  const t = useTranslations();

  return (
    <ReadMore header={t('client.steg.introduksjon.opplysninger.title')} variant="moderate">
      <BodyShort spacing>{t('client.steg.introduksjon.opplysninger.label')}</BodyShort>
      <ul>
        <li>{t('client.steg.introduksjon.opplysninger.bulletList.item.1')}</li>
        <li>{t('client.steg.introduksjon.opplysninger.bulletList.item.2')}</li>
        <li>{t('client.steg.introduksjon.opplysninger.bulletList.item.3')}</li>
        <li>{t('client.steg.introduksjon.opplysninger.bulletList.item.4')}</li>
        <li>{t('client.steg.introduksjon.opplysninger.bulletList.item.5')}</li>
      </ul>
      {t.rich('client.steg.introduksjon.opplysninger.link', {
        a: (chunks) => {
          return (
            <Link href={'https://www.nav.no/personvern-sikkerhet-navno'} target={'_blank'}>
              {chunks}
            </Link>
          );
        },
      })}
    </ReadMore>
  );
};
