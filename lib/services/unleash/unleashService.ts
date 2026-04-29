import { Unleash } from 'unleash-client';
import { FlagNames, FLAGS, Flags, mockedFlags } from 'lib/services/unleash/unleashToggles';
import { isLocal } from 'lib/utils/environments';

export interface IUnleash {
  isEnabled(flagName: FlagNames): boolean;
}

function getRequiredEnv(name: 'UNLEASH_SERVER_API_URL' | 'UNLEASH_SERVER_API_ENV' | 'UNLEASH_SERVER_API_TOKEN'): string {
  const value = process.env[name];

  if (value == null || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function createRealUnleash(): IUnleash {
  const url = getRequiredEnv('UNLEASH_SERVER_API_URL');
  const environment = getRequiredEnv('UNLEASH_SERVER_API_ENV');
  const token = getRequiredEnv('UNLEASH_SERVER_API_TOKEN');

  return new Unleash({
    url: `${url}/api`,
    environment,
    appName: 'aap-meldekort',
    customHeaders: {
      Authorization: token,
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
