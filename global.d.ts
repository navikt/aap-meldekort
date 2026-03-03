import nb from './lib/translations/nb.json';
import { formats } from 'i18n/request';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof nb;
    Formats: typeof formats;
  }
}
