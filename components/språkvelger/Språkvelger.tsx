'use client';

import { onLanguageSelect, setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';
import { useEffect } from 'react';
import { availableLanguages } from 'lib/locale/locale';
import { usePathname, useRouter } from 'next/navigation';

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
    const pathWithoutLanguage = pathname.substring(3);
    const url = `/${language.locale}${pathWithoutLanguage}`;
    router.push(url);
  });

  return <></>;
};
