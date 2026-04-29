import { Unleash } from 'unleash-client';
import { FlagNames, FLAGS, Flags, mockedFlags } from 'lib/services/unleash/unleashToggles';
import { isLocal } from 'lib/utils/environments';

export interface IUnleash {
  isEnabled(flagName: FlagNames): boolean;
}

function createRealUnleash(): IUnleash {
  return new Unleash({
    url: `${process.env.UNLEASH_SERVER_API_URL}/api`,
    environment: process.env.UNLEASH_SERVER_API_ENV!,
    appName: 'aap-saksbehandling',
    customHeaders: {
      Authorization: process.env.UNLEASH_SERVER_API_TOKEN!,
    },
  });
}

function createMockUnleash(): IUnleash {
  return {
    isEnabled: (flagName: FlagNames) => mockedFlags[flagName],
  };
}

let unleashService: IUnleash | undefined;

// Bruk mock-unleash hvis LOKALT og env-variabel ikke er satt, for DEV og PROD bruker den alltid ekte unleash
export function getUnleashService(): IUnleash {
  if (unleashService == null) {
    unleashService =
      process.env.UNLEASH_SERVER_API_URL == null && isLocal() ? createMockUnleash() : createRealUnleash();
  }

  return unleashService;
}

export function getAllFlags(): Flags {
  const unleashService = getUnleashService();
  return Object.fromEntries(FLAGS.map((name) => [name, unleashService.isEnabled(name)])) as Flags;
}
