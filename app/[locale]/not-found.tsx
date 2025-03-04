'use server';

import { Heading } from '@navikt/ds-react';
import { Link } from 'i18n/routing';
import { getTranslations } from 'next-intl/server';

//404 Page
const NotFound = async () => {
  const t = await getTranslations();
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        marginBlockStart: '2rem',
      }}
    >
      <Heading level="2" size="large" spacing>
        {t('page.notFound.heading')}
      </Heading>
      <Link href={`/`}>{t('page.notFound.tilbakeLink')}</Link>
    </div>
  );
};

export default NotFound;
