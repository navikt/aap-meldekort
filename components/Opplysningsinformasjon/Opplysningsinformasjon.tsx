'use client';

import { Accordion, BodyShort, Link } from '@navikt/ds-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export const Opplysningsinformasjon = () => {
  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Accordion>
      <Accordion.Item open={isOpen}>
        <Accordion.Header onClick={() => setIsOpen(!isOpen)}>
          {t('client.steg.introduksjon.opplysninger.title')}
        </Accordion.Header>
        <Accordion.Content tabIndex={!isOpen ? -1 : undefined}>
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
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};
