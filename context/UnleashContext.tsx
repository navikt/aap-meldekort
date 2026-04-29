'use client';

import { createContext, type ReactNode, useContext } from 'react';
import { FlagNames, Flags } from 'lib/services/unleash/unleashToggles';

const FeatureFlagContext = createContext<Flags | null>(null);

export function FeatureFlagProvider({ flags, children }: { flags: Flags; children: ReactNode }) {
  return <FeatureFlagContext.Provider value={flags}>{children}</FeatureFlagContext.Provider>;
}

export function useFeatureFlag(featureToggleName: FlagNames): boolean {
  const featureContext = useContext(FeatureFlagContext);
  if (!featureContext) throw new Error('FeatureFlagProvider missing');
  return featureContext[featureToggleName];
}
