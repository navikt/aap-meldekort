'use client';

import { BodyShort, Heading, Link, List } from '@navikt/ds-react';
import { useRouter } from 'i18n/routing';
import { useTranslations } from 'next-intl';

//500 Page
const Error = () => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <div>
      <Heading level="1" size="large" spacing>
        {t('client.page.error.heading')}
      </Heading>
      <BodyShort spacing>{t('client.page.error.description')}</BodyShort>
      <BodyShort>{t('client.page.error.bulletList.title')}</BodyShort>
      <List>
        <List.Item>
          {t.rich('client.page.error.bulletList.items.1', {
            a: (chunks) => (
              <Link href="#" onClick={() => location.reload()}>
                {chunks}
              </Link>
            ),
          })}
        </List.Item>
        <List.Item>
          {t.rich('client.page.error.bulletList.items.2', {
            a: (chunks) => (
              <Link href="#" onClick={() => router.push('/')}>
                {chunks}
              </Link>
            ),
          })}
        </List.Item>
      </List>
      <BodyShort spacing>
        {t.rich('client.page.error.vedvarer', {
          a: (chunks) => (
            <Link href="https://www.nav.no/kontaktoss" target="_blank">
              {chunks}
            </Link>
          ),
        })}
      </BodyShort>
    </div>
  );
};

export default Error;
