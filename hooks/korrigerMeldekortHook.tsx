'use client';

import { useContext } from 'react';
import { KorrigeringContext } from 'context/KorrigeringContext';

export function useKorrigerMeldekort() {
  const context = useContext(KorrigeringContext);

  if (!context) {
    throw new Error('useKorrigeringContext must be used within a KorrigeringProvider');
  }

  return context;
}
