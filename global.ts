import messages from './messages/nb.json';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof messages;
  }
}
