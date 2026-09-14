import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  const isSupportedLocale = routing.locales.some((supportedLocale) => supportedLocale === locale);
  if (!locale || !isSupportedLocale) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../lib/translations/${locale}.json`)).default,
  };
});
