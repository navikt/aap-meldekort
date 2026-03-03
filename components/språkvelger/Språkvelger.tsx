'use client';

import { onLanguageSelect, setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';
import { useEffect } from 'react';
import { availableLanguages } from 'lib/messages/locale';
import { usePathname, useRouter } from 'i18n/routing';

export const Språkvelger = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setAvailableLanguages(
      availableLanguages.map((lang) => {
        return { locale: lang, handleInApp: true };
      })
    );
  }, []);

  onLanguageSelect((language) => {
    router.push(pathname, { locale: language.locale });
  });

  return <></>;
};
