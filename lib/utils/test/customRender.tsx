import { cleanup, render } from '@testing-library/react';
import { ReactElement } from 'react';
import { afterEach } from 'vitest';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { Flags, mockedFlags } from 'lib/services/unleash/unleashToggles';
import { NextIntlClientProvider } from 'next-intl';
import messagesNb from 'lib/translations/nb.json';

afterEach(() => {
  cleanup();
});

export function customRender(ui: ReactElement, options?: { flags?: Partial<Flags> }) {
  render(
    <FeatureFlagProvider flags={{ ...mockedFlags, ...options?.flags }}>
      <NextIntlClientProvider locale={'nb'} messages={messagesNb}>
        {ui}
      </NextIntlClientProvider>
    </FeatureFlagProvider>
  );
}

export * from '@testing-library/react';
export { customRender as render };
