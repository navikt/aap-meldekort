'use client';

import { MeldekortRequest } from 'lib/types/types';
import { lagreMeldekortClient } from 'lib/client/clientApi';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export function useMellomlagreMeldekort(): {
  mellomlagreMeldekort: (meldekort: MeldekortRequest) => void;
  sistLagret: Date;
  error?: string;
} {
  const params = useParams<{ system: string; referanse: string; aktivtSteg: string }>();
  const [error, setError] = useState<string>();

  function mellomlagreMeldekort(meldekort: MeldekortRequest) {
    try {
      lagreMeldekortClient(params.referanse, meldekort);
    } catch (e) {
      setError('Kunne ikke mellomlagre meldekort');
    }
  }

  return { mellomlagreMeldekort, sistLagret: new Date(), error };
}
